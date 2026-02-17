import * as BABYLON from "@babylonjs/core";
import * as BABYLON_GUI from "@babylonjs/gui";
import { BabylonScene } from "./Scene";
import { AbstractConstructionMode } from "../../../abstract/AbstractConstructionMode";
import { AbstractScene } from "../../../abstract/AbstractScene";
import { getSnappedGroundDirections } from "../common/utils";

const FLOOR_THICKNESS = 0.2;

export class FloorMode implements AbstractConstructionMode {
  private floorMaterial: BABYLON.StandardMaterial;
  private ribbonMaterial: BABYLON.StandardMaterial;
  private measurementLineMaterial: BABYLON.StandardMaterial;
  private startPoint: BABYLON.Vector3 | null = null;
  private endPoint: BABYLON.Vector3 | null = null;
  private ribbon: BABYLON.Mesh = null;
  private preRibbon: BABYLON.Mesh = null;
  private measurementLineX: BABYLON.LinesMesh = null;
  private measurementLineZ: BABYLON.LinesMesh = null;
  private textPlaceholderX: BABYLON.Mesh = null;
  private textPlaceholderZ: BABYLON.Mesh = null;
  private textRectangle: BABYLON_GUI.AdvancedDynamicTexture = null;
  private labelRectX: BABYLON_GUI.Rectangle = null;
  private labelRectZ: BABYLON_GUI.Rectangle = null;
  private textBlockX: BABYLON_GUI.TextBlock = null;
  private textBlockZ: BABYLON_GUI.TextBlock = null;
  private rectPoints: BABYLON.Vector3[] = [];
  private floors: BABYLON.Mesh[] = [];
  private scene: BABYLON.Scene;
  private babylonScene: BabylonScene;

  constructor(scene: AbstractScene) {
    this.babylonScene = scene as BabylonScene;
    this.scene = this.babylonScene.getUnderlyingScene();
    this.prepareMaterials();
    this.prepareUI();
  }

  private prepareUI(): void {
    this.prepareTextPlaceholders();
    this.prepareTextRectangle();
  }

  private prepareTextPlaceholders(): void {
    this.textPlaceholderX = BABYLON.MeshBuilder.CreateBox(
      "textPlaceholderX",
      { size: 0.01 },
      this.scene
    );
    this.textPlaceholderZ = BABYLON.MeshBuilder.CreateBox(
      "textPlaceholderZ",
      { size: 0.01 },
      this.scene
    );
    this.textPlaceholderX.isVisible = false;
    this.textPlaceholderZ.isVisible = false;
  }

  private createLabelRect(): BABYLON_GUI.Rectangle {
    const rect = new BABYLON_GUI.Rectangle();
    rect.isVisible = false;
    rect.background = "white";
    rect.color = "blue";
    rect.thickness = 1;
    rect.cornerRadius = 8;
    rect.width = "45px";
    rect.height = "25px";

    return rect;
  }

  private createTextBlock(): BABYLON_GUI.TextBlock {
    const textBlock = new BABYLON_GUI.TextBlock();
    textBlock.text = "0.0 m";
    textBlock.color = "black";
    textBlock.fontSize = 10;

    return textBlock;
  }

  private prepareTextRectangle(): void {
    this.textRectangle =
      BABYLON_GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "FloorDimensionsUI"
      );

    this.labelRectX = this.createLabelRect();
    this.textBlockX = this.createTextBlock();
    this.labelRectX.addControl(this.textBlockX);
    this.textRectangle.addControl(this.labelRectX);
    this.labelRectX.linkWithMesh(this.textPlaceholderX);

    this.labelRectZ = this.createLabelRect();
    this.textBlockZ = this.createTextBlock();
    this.labelRectZ.addControl(this.textBlockZ);
    this.textRectangle.addControl(this.labelRectZ);
    this.labelRectZ.linkWithMesh(this.textPlaceholderZ);
  }

  private moveTextPlaceholderToPoint(
    placeholder: BABYLON.Mesh,
    point: BABYLON.Vector3
  ): void {
    placeholder.position = point.clone();
  }

  private makeMaterialOverlay(material: BABYLON.StandardMaterial): void {
    material.depthFunction = BABYLON.Constants.ALWAYS;
    material.disableDepthWrite = true;
  }

  private createOverlayMaterial(
    name: string,
    color: BABYLON.Color3
  ): BABYLON.StandardMaterial {
    const material = new BABYLON.StandardMaterial(name, this.scene);
    material.emissiveColor = color;
    this.makeMaterialOverlay(material);
    return material;
  }

  private createWoodMaterial(): BABYLON.StandardMaterial {
    const woodMaterial = new BABYLON.StandardMaterial(
      "woodMaterial",
      this.scene
    );
    woodMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.4, 0.2);
    woodMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    woodMaterial.specularPower = 32;

    return woodMaterial;
  }

  private prepareMaterials(): void {
    this.floorMaterial = this.createWoodMaterial();
    this.ribbonMaterial = this.createOverlayMaterial(
      "ribbonMaterial",
      BABYLON.Color3.Blue()
    );
    this.ribbonMaterial.disableLighting = true;
    this.ribbonMaterial.emissiveColor = BABYLON.Color3.Blue();
    this.ribbonMaterial.alpha = 0.5;
    this.ribbonMaterial.backFaceCulling = false;
    this.measurementLineMaterial = this.createOverlayMaterial(
      "measurementLineMaterial",
      BABYLON.Color3.Purple()
    );
  }

  private enableUI(): void {
    this.labelRectX.isVisible = true;
    this.labelRectZ.isVisible = true;
  }

  private disableUI(): void {
    this.labelRectX.isVisible = false;
    this.labelRectZ.isVisible = false;
  }

  private disposeFloors(): void {
    this.floors.forEach((floor) => {
      floor.dispose();
    });
    this.floors = [];
  }

  private createFloorMesh(points: BABYLON.Vector3[]): void {
    const floor = BABYLON.MeshBuilder.CreateBox(
      `floor${this.floors.length + 1}`,
      { width: 1, height: FLOOR_THICKNESS, depth: 1 },
      this.scene
    );

    const [p1, p2, p3, p4] = points;
    const center = p1.add(p2).add(p3).add(p4).scale(0.25);
    const widthVec = p2.subtract(p1);
    const depthVec = p4.subtract(p1);
    const width = widthVec.length();
    const depth = depthVec.length();

    floor.scaling = new BABYLON.Vector3(width, FLOOR_THICKNESS, depth);
    floor.position = center.add(
      new BABYLON.Vector3(0, FLOOR_THICKNESS * 0.5, 0)
    );
    floor.material = this.floorMaterial;
    this.floors.push(floor);
  }

  private getRectPoints(
    topLeftCorner: BABYLON.Vector3,
    cursorPoint: BABYLON.Vector3
  ): BABYLON.Vector3[] {
    const camera = this.scene.activeCamera;
    if (!camera) return;

    const snappedDirections = getSnappedGroundDirections(
      camera.getForwardRay().direction
    );
    const rightDir = snappedDirections.right;
    const forwardDir = snappedDirections.forward;

    const p1 = topLeftCorner;
    const p2 = topLeftCorner.add(
      rightDir.scale(cursorPoint.subtract(topLeftCorner).dot(rightDir))
    );
    const p3 = p2.add(
      forwardDir.scale(cursorPoint.subtract(topLeftCorner).dot(forwardDir))
    );
    const p4 = topLeftCorner.add(
      forwardDir.scale(cursorPoint.subtract(topLeftCorner).dot(forwardDir))
    );

    return [p1, p2, p3, p4];
  }

  private onStartClick(pointerInfo: BABYLON.PointerInfo): void {
    const camera = this.scene.activeCamera;
    if (!camera) return;

    const snappedDirections = getSnappedGroundDirections(
      camera.getForwardRay().direction
    );
    this.startPoint = pointerInfo.pickInfo.pickedPoint.add(
      snappedDirections.forward.scale(0.5)
    );
  }

  private disposeMeasurementUI(): void {
    if (this.ribbon) {
      this.removeMesh("ribbon", this.ribbon);
      this.removeMesh("measurementLineX", this.measurementLineX);
      this.removeMesh("measurementLineZ", this.measurementLineZ);
      this.removeMesh("preRibbon", this.preRibbon);
      this.disableUI();
    }
  }

  private onEndClick(): void {
    this.disposeMeasurementUI();
    this.createFloorMesh(this.rectPoints);
    this.startPoint = null;
  }

  private getRibbonPathArray(points: BABYLON.Vector3[]): BABYLON.Vector3[][] {
    const [p1, p2, p3, p4] = points;
    const path1 = [p1, p4];
    const path2 = [p2, p3];

    return [path1, path2];
  }

  private getPreRibbonPathArray(
    groundMeshPickedPoint: BABYLON.Vector3
  ): BABYLON.Vector3[][] {
    const camera = this.scene.activeCamera;
    if (!camera) return [];

    const snappedDirections = getSnappedGroundDirections(
      camera.getForwardRay().direction
    );
    const rightDir = snappedDirections.right;
    const forwardDir = snappedDirections.forward;

    const start = groundMeshPickedPoint;
    const end = start.add(rightDir.scale(0.5));
    const path1 = [start.add(forwardDir), end.add(forwardDir)];
    const path2 = [start.subtract(forwardDir), end.subtract(forwardDir)];

    return [path1, path2];
  }

  private createMeasurementLineX(points: BABYLON.Vector3[]): void {
    this.measurementLineX = this.createLine(
      "measurementLineX",
      points,
      this.measurementLineMaterial
    );
  }

  private createMeasurementLineZ(points: BABYLON.Vector3[]): void {
    this.measurementLineZ = this.createLine(
      "measurementLineZ",
      points,
      this.measurementLineMaterial
    );
  }

  private createLine(
    name: string,
    points: BABYLON.Vector3[],
    material: BABYLON.StandardMaterial
  ): BABYLON.LinesMesh {
    const line = BABYLON.MeshBuilder.CreateLines(
      name,
      { points, updatable: true },
      this.scene
    );
    line.material = material;

    return line;
  }

  private updateLine(line: BABYLON.LinesMesh, points: BABYLON.Vector3[]): void {
    BABYLON.MeshBuilder.CreateLines(
      null,
      { points, instance: line },
      this.scene
    );
  }

  private createRibbon(pathArray: BABYLON.Vector3[][]): void {
    this.ribbon = BABYLON.MeshBuilder.CreateRibbon(
      "floorRibbon",
      {
        pathArray,
        updatable: true
      },
      this.scene
    );
    this.ribbon.material = this.ribbonMaterial;
  }

  private updateRibbon(pathArray: BABYLON.Vector3[][]): void {
    BABYLON.MeshBuilder.CreateRibbon(
      null,
      {
        pathArray,
        instance: this.ribbon
      },
      this.scene
    );
  }

  private addPreRibbon(pathArray: BABYLON.Vector3[][]): void {
    if (!this.preRibbon) {
      this.preRibbon = BABYLON.MeshBuilder.CreateRibbon(
        "preRibbon",
        {
          pathArray,
          updatable: true
        },
        this.scene
      );
      this.preRibbon.material = this.ribbonMaterial;
    } else {
      BABYLON.MeshBuilder.CreateRibbon(
        null,
        {
          pathArray,
          instance: this.preRibbon
        },
        this.scene
      );
    }
  }

  private removeMesh(name: string, mesh: BABYLON.AbstractMesh): void {
    if (mesh) {
      this.scene.removeMesh(mesh);
      mesh.dispose();
      this[name] = null;
    }
  }

  private getGroundMeshPickedPoint(
    pointerInfo: BABYLON.PointerInfo
  ): BABYLON.Vector3 | null {
    const pickedObject = this.scene.pick(
      pointerInfo.event.clientX,
      pointerInfo.event.clientY,
      (mesh) => mesh === this.babylonScene.getGroundMesh()
    );
    const groundMeshId = this.babylonScene.getGroundMesh().id;

    if (!pickedObject || pickedObject.pickedMesh?.id !== groundMeshId) {
      return null;
    }

    return pickedObject.pickedPoint;
  }

  private updateMeasurementLabels(width: number, length: number): void {
    this.textBlockX.text = `${width.toFixed(2)} m`;
    this.textBlockZ.text = `${length.toFixed(2)} m`;
  }

  private getXLinePoints(rectPoints: BABYLON.Vector3[]): BABYLON.Vector3[] {
    return [rectPoints[0], rectPoints[1]];
  }

  private getZLinePoints(rectPoints: BABYLON.Vector3[]): BABYLON.Vector3[] {
    return [rectPoints[0], rectPoints[3]];
  }

  public onClick(pointerInfo: BABYLON.PointerInfo): void {
    if (!this.startPoint) {
      this.onStartClick(pointerInfo);
    } else {
      this.onEndClick();
    }
  }

  private updateDistanceLabels(rectPoints: BABYLON.Vector3[]): void {
    const midX = rectPoints[0].add(rectPoints[1]).scale(0.5);
    this.moveTextPlaceholderToPoint(this.textPlaceholderX, midX);
    const midZ = rectPoints[0].add(rectPoints[3]).scale(0.5);
    this.moveTextPlaceholderToPoint(this.textPlaceholderZ, midZ);
    const widthLength = BABYLON.Vector3.Distance(rectPoints[0], rectPoints[1]);
    const lengthLength = BABYLON.Vector3.Distance(rectPoints[0], rectPoints[3]);
    this.updateMeasurementLabels(widthLength, lengthLength);
  }

  public onMouseMove(pointerInfo: BABYLON.PointerInfo): void {
    const groundMeshPickedPoint = this.getGroundMeshPickedPoint(pointerInfo);

    if (!this.startPoint && groundMeshPickedPoint) {
      this.addPreRibbon(this.getPreRibbonPathArray(groundMeshPickedPoint));
    } else if (this.startPoint) {
      this.removeMesh("preRibbon", this.preRibbon);
    }

    if (!this.startPoint || !groundMeshPickedPoint) {
      return;
    }

    this.endPoint = groundMeshPickedPoint.clone();
    this.rectPoints = this.getRectPoints(this.startPoint, this.endPoint);
    const ribbonPathArray = this.getRibbonPathArray(this.rectPoints);

    this.updateDistanceLabels(this.rectPoints);
    const xLinePoints = this.getXLinePoints(this.rectPoints);
    const zLinePoints = this.getZLinePoints(this.rectPoints);

    if (!this.ribbon) {
      this.createRibbon(ribbonPathArray);
      this.createMeasurementLineX(xLinePoints);
      this.createMeasurementLineZ(zLinePoints);
      this.enableUI();
    } else {
      this.updateRibbon(ribbonPathArray);
      this.updateLine(this.measurementLineX, xLinePoints);
      this.updateLine(this.measurementLineZ, zLinePoints);
    }
  }

  public dispose(): void {
    this.disposeMeasurementUI();
    this.textRectangle.dispose();
    this.textPlaceholderX.dispose();
    this.textPlaceholderZ.dispose();
    this.disposeFloors();
  }
}
