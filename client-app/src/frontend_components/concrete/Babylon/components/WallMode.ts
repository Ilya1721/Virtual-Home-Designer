import * as BABYLON from "@babylonjs/core";
import * as BABYLON_GUI from "@babylonjs/gui";
import earcut from "earcut";
import { BabylonScene } from "./Scene";
import { AbstractConstructionMode } from "../../../abstract/AbstractConstructionMode";
import { AbstractScene } from "../../../abstract/AbstractScene";
import { WALL_HEIGHT, WALL_THICKNESS } from "../common/constants";
import { getSnappedGroundDirections } from "../common/utils";

export class WallMode implements AbstractConstructionMode {
  private wallMaterial: BABYLON.StandardMaterial;
  private ribbonMaterial: BABYLON.StandardMaterial;
  private measurementLineMaterial: BABYLON.StandardMaterial;
  private startPoint: BABYLON.Vector3 | null = null;
  private endPoint: BABYLON.Vector3 | null = null;
  private lineOrthoVec: BABYLON.Vector3 | null = null;
  private ribbon: BABYLON.Mesh = null;
  private preRibbon: BABYLON.Mesh = null;
  private startSideLine: BABYLON.LinesMesh = null;
  private endSideLine: BABYLON.LinesMesh = null;
  private measurementLine: BABYLON.LinesMesh = null;
  private textPlaceholder: BABYLON.Mesh = null;
  private textRectangle: BABYLON_GUI.AdvancedDynamicTexture = null;
  private labelRect: BABYLON_GUI.Rectangle = null;
  private textBlock: BABYLON_GUI.TextBlock = null;
  private walls: BABYLON.Mesh[] = [];
  private scene: BABYLON.Scene;
  private babylonScene: BabylonScene;

  constructor(scene: AbstractScene) {
    this.babylonScene = scene as BabylonScene;
    this.scene = this.babylonScene.getUnderlyingScene();
    this.prepareMaterials();
    this.prepareUI();
  }

  private prepareUI(): void {
    this.prepareTextPlaceholder();
    this.prepareTextRectangle();
  }

  private prepareTextPlaceholder(): void {
    this.textPlaceholder = BABYLON.MeshBuilder.CreateBox(
      "textPlaceholder",
      { size: 0.01 },
      this.scene
    );
    this.textPlaceholder.isVisible = false;
  }

  private prepareTextRectangle(): void {
    this.textRectangle =
      BABYLON_GUI.AdvancedDynamicTexture.CreateFullscreenUI("WallLengthUI");

    this.labelRect = new BABYLON_GUI.Rectangle();
    this.labelRect.isVisible = false;
    this.labelRect.background = "white";
    this.labelRect.color = "blue";
    this.labelRect.thickness = 1;
    this.labelRect.cornerRadius = 8;
    this.labelRect.width = "45px";
    this.labelRect.height = "25px";

    this.textBlock = new BABYLON_GUI.TextBlock();
    this.textBlock.text = "0.0 m";
    this.textBlock.color = "black";
    this.textBlock.fontSize = 10;

    this.labelRect.addControl(this.textBlock);
    this.textRectangle.addControl(this.labelRect);
    this.labelRect.linkWithMesh(this.textPlaceholder);
  }

  private moveTextPlaceholderToLineMidpoint(points: BABYLON.Vector3[]): void {
    this.textPlaceholder.position = points[0].add(points[1]).scale(0.5);
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

  private prepareMaterials(): void {
    this.wallMaterial = new BABYLON.StandardMaterial(
      "wallMaterial",
      this.scene
    );
    this.wallMaterial.diffuseColor = BABYLON.Color3.Gray();
    this.ribbonMaterial = this.createOverlayMaterial(
      "ribbonMaterial",
      BABYLON.Color3.Blue()
    );
    this.ribbonMaterial.disableLighting = true;
    this.ribbonMaterial.emissiveColor = BABYLON.Color3.Blue();
    this.ribbonMaterial.alpha = 0.5;
    this.measurementLineMaterial = this.createOverlayMaterial(
      "measurementLineMaterial",
      BABYLON.Color3.Purple()
    );
  }

  private enableUI(): void {
    this.labelRect.isVisible = true;
  }

  private disableUI(): void {
    this.labelRect.isVisible = false;
  }

  private disposeWalls(): void {
    this.walls.forEach((wall) => {
      wall.dispose();
    });
    this.walls = [];
  }

  private createWallMesh(rectangle: BABYLON.Vector3[]): void {
    const wall = BABYLON.MeshBuilder.ExtrudePolygon(
      `wall${this.walls.length + 1}`,
      {
        shape: rectangle,
        depth: WALL_HEIGHT
      },
      this.scene,
      earcut
    );
    wall.material = this.wallMaterial;
    wall.translate(BABYLON.Axis.Y, WALL_HEIGHT);
    this.walls.push(wall);
  }

  private buildWall(): void {
    const wallDir = this.endPoint.subtract(this.startPoint).normalize();
    const wallOrthoVec = new BABYLON.Vector3(-wallDir.z, 0, wallDir.x);
    const halfThickness = WALL_THICKNESS * 0.5;

    const p1 = this.startPoint.add(wallOrthoVec.scale(halfThickness));
    const p2 = this.startPoint.add(wallOrthoVec.scale(-halfThickness));
    const p3 = this.endPoint.add(wallOrthoVec.scale(-halfThickness));
    const p4 = this.endPoint.add(wallOrthoVec.scale(halfThickness));
    this.createWallMesh([p1, p2, p3, p4]);
  }

  private onStartClick(pointerInfo: BABYLON.PointerInfo): void {
    this.startPoint = pointerInfo.pickInfo.pickedPoint;
  }

  private disposeMeasurementUI(): void {
    if (this.ribbon) {
      this.removeMesh("ribbon", this.ribbon);
      this.removeMesh("measurementLine", this.measurementLine);
      this.removeMesh("startSideLine", this.startSideLine);
      this.removeMesh("endSideLine", this.endSideLine);
      this.removeMesh("preRibbon", this.preRibbon);
      this.disableUI();
    }
  }

  private onEndClick(): void {
    this.disposeMeasurementUI();
    this.buildWall();
    this.startPoint = null;
  }

  private getLinePoints(): BABYLON.Vector3[] {
    const orthoVec = this.lineOrthoVec.scale(WALL_THICKNESS * 2.0);
    const newStartPoint = this.startPoint.add(orthoVec);
    const newEndPoint = this.endPoint.add(orthoVec);

    return [newStartPoint, newEndPoint];
  }

  private getSideLinePoints(point: BABYLON.Vector3): BABYLON.Vector3[] {
    const orthoVec = this.lineOrthoVec.scale(WALL_THICKNESS * 0.4);
    const sideStartPoint = point.add(orthoVec);
    const sideEndPoint = point.subtract(orthoVec);

    return [sideStartPoint, sideEndPoint];
  }

  private getRibbonPathArray(): BABYLON.Vector3[][] {
    const ribbonDir = this.endPoint.subtract(this.startPoint);
    const upDir = new BABYLON.Vector3(-ribbonDir.z, 0, ribbonDir.x)
      .normalize()
      .scale(WALL_THICKNESS * 0.5);

    const path1 = [this.startPoint.add(upDir), this.endPoint.add(upDir)];
    const path2 = [
      this.startPoint.subtract(upDir),
      this.endPoint.subtract(upDir)
    ];

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

  private getRibbonEndPoint(
    currentMousePoint: BABYLON.Vector3
  ): BABYLON.Vector3 {
    const finalPoint = currentMousePoint.clone();
    const lineDir = currentMousePoint.subtract(this.startPoint).normalize();
    const absX = Math.abs(lineDir.x);
    const absZ = Math.abs(lineDir.z);
    if (absX < absZ) {
      finalPoint.x = this.startPoint.x;
      this.lineOrthoVec = new BABYLON.Vector3(-1, 0, 0);
    } else {
      finalPoint.z = this.startPoint.z;
      this.lineOrthoVec = new BABYLON.Vector3(0, 0, -1);
    }

    return finalPoint;
  }

  private createMeasurementLine(points: BABYLON.Vector3[]): void {
    this.measurementLine = this.createLine(
      "measurementLine",
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

  private createStartSideLine(point: BABYLON.Vector3): void {
    const points = this.getSideLinePoints(point);
    this.startSideLine = this.createLine(
      "startSideLine",
      points,
      this.measurementLineMaterial
    );
  }

  private createEndSideLine(point: BABYLON.Vector3): void {
    const points = this.getSideLinePoints(point);
    this.endSideLine = this.createLine(
      "endSideLine",
      points,
      this.measurementLineMaterial
    );
  }

  private updateLine(line: BABYLON.LinesMesh, points: BABYLON.Vector3[]): void {
    BABYLON.MeshBuilder.CreateLines(
      null,
      { points, instance: line },
      this.scene
    );
  }

  private updateSideLine(
    line: BABYLON.LinesMesh,
    point: BABYLON.Vector3
  ): void {
    const points = this.getSideLinePoints(point);
    this.updateLine(line, points);
  }

  private createRibbon(pathArray: BABYLON.Vector3[][]): void {
    this.ribbon = BABYLON.MeshBuilder.CreateRibbon(
      "wallRibbon",
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

  private updateMeasurementLabel(distance: number): void {
    this.textBlock.text = `${distance.toFixed(2)} m`;
  }

  public onClick(pointerInfo: BABYLON.PointerInfo): void {
    if (!this.startPoint) {
      this.onStartClick(pointerInfo);
    } else {
      this.onEndClick();
    }
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

    this.endPoint = this.getRibbonEndPoint(groundMeshPickedPoint);
    const ribbonPathArray = this.getRibbonPathArray();
    const linePoints = this.getLinePoints();
    this.moveTextPlaceholderToLineMidpoint(linePoints);
    const wallLength = BABYLON.Vector3.Distance(this.startPoint, this.endPoint);
    this.updateMeasurementLabel(wallLength);

    if (!this.ribbon) {
      this.createRibbon(ribbonPathArray);
      this.createMeasurementLine(linePoints);
      this.createStartSideLine(linePoints[0]);
      this.createEndSideLine(linePoints[1]);
      this.enableUI();
    } else {
      this.updateRibbon(ribbonPathArray);
      this.updateLine(this.measurementLine, linePoints);
      this.updateSideLine(this.startSideLine, linePoints[0]);
      this.updateSideLine(this.endSideLine, linePoints[1]);
    }
  }

  public dispose(): void {
    this.disposeMeasurementUI();
    this.textRectangle.dispose();
    this.textPlaceholder.dispose();
    this.disposeWalls();
  }
}
