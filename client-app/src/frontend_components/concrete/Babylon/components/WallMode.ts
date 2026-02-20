import * as BABYLON from "@babylonjs/core";
import * as BABYLON_GUI from "@babylonjs/gui";
import earcut from "earcut";
import { BabylonScene } from "./Scene";
import { AbstractConstructionMode } from "../../../abstract/AbstractConstructionMode";
import { AbstractScene } from "../../../abstract/AbstractScene";
import { WALL_HEIGHT, WALL_THICKNESS } from "../common/constants";
import { getXZOrthoVec, isEqual } from "../common/utils";

export class WallMode implements AbstractConstructionMode {
  private wallMaterial: BABYLON.StandardMaterial;
  private ribbonMaterial: BABYLON.StandardMaterial;
  private measurementLineMaterial: BABYLON.StandardMaterial;
  private ribbonPathArray: BABYLON.Vector3[][] = [];
  private startPoint: BABYLON.Vector3 | null = null;
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
    this.prepareGeometry();
  }

  private prepareGeometry(): void {
    this.ribbonPathArray = this.getRibbonPathArray();
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

  private createOverlayMaterial(
    name: string,
    color: BABYLON.Color3
  ): BABYLON.StandardMaterial {
    const material = new BABYLON.StandardMaterial(name, this.scene);
    material.emissiveColor = color;
    material.depthFunction = BABYLON.Constants.ALWAYS;
    material.disableDepthWrite = true;
    material.disableLighting = true;

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

  private createWallMesh(rectangle: BABYLON.Vector3[]): BABYLON.Mesh {
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

    return wall;
  }

  private buildWall(endPoint: BABYLON.Vector3): void {
    const wallDir = endPoint.subtract(this.startPoint).normalize();
    const wallOrthoVec = new BABYLON.Vector3(-wallDir.z, 0, wallDir.x);
    const halfThickness = WALL_THICKNESS * 0.5;
    const [shiftedStartPoint, shiftedEndPoint] = this.getRibbonShiftedPoints(
      [this.startPoint, endPoint],
      wallDir
    );

    const p1 = shiftedStartPoint.add(wallOrthoVec.scale(halfThickness));
    const p2 = shiftedStartPoint.add(wallOrthoVec.scale(-halfThickness));
    const p3 = shiftedEndPoint.add(wallOrthoVec.scale(-halfThickness));
    const p4 = shiftedEndPoint.add(wallOrthoVec.scale(halfThickness));
    const wall = this.createWallMesh([p1, p2, p3, p4]);
    this.walls.push(wall);
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

  private onEndClick(pointerInfo: BABYLON.PointerInfo): void {
    const groundMeshPickedPoint = this.getGroundMeshPickedPoint(pointerInfo);
    if (groundMeshPickedPoint) {
      this.disposeMeasurementUI();
      const snappedEndPoint = this.getSnappedEndPoint(groundMeshPickedPoint);
      this.buildWall(snappedEndPoint);
      this.startPoint = null;
    }
  }

  private getRibbonShiftedPoints(
    points: BABYLON.Vector3[],
    ribbonDir: BABYLON.Vector3
  ): BABYLON.Vector3[] {
    const shiftVec = ribbonDir.scale(WALL_THICKNESS * 0.5).negate();
    return points.map((point: BABYLON.Vector3) => {
      return point.add(shiftVec);
    });
  }

  private getLinePoints(
    startPoint: BABYLON.Vector3,
    endPoint: BABYLON.Vector3,
    orthoVec: BABYLON.Vector3
  ): BABYLON.Vector3[] {
    const orthoVecScaled = orthoVec.scale(WALL_THICKNESS * 2.0);
    const newStartPoint = startPoint.add(orthoVecScaled);
    const newEndPoint = endPoint.add(orthoVecScaled);

    return [newStartPoint, newEndPoint];
  }

  private getSideLinePoints(
    point: BABYLON.Vector3,
    orthoVec: BABYLON.Vector3
  ): BABYLON.Vector3[] {
    const orthoVecScaled = orthoVec.scale(WALL_THICKNESS * 0.4);
    const sideStartPoint = point.add(orthoVecScaled);
    const sideEndPoint = point.subtract(orthoVecScaled);

    return [sideStartPoint, sideEndPoint];
  }

  private getRibbonPathArray(): BABYLON.Vector3[][] {
    const halfLength = WALL_THICKNESS * 0.5;
    const topLeftCorner = new BABYLON.Vector3(-halfLength, 0, halfLength);
    const topRightCorner = new BABYLON.Vector3(halfLength, 0, halfLength);
    const bottomLeftCorner = new BABYLON.Vector3(-halfLength, 0, -halfLength);
    const bottomRightCorner = new BABYLON.Vector3(halfLength, 0, -halfLength);

    const path1 = [topLeftCorner, topRightCorner];
    const path2 = [bottomLeftCorner, bottomRightCorner];

    return [path1, path2];
  }

  private createMeasurementLine(points: BABYLON.Vector3[]): void {
    if (!this.measurementLine) {
      this.measurementLine = this.createLine(
        "measurementLine",
        points,
        this.measurementLineMaterial
      );
    } else {
      this.updateLine(this.measurementLine, points);
    }
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

  private createStartSideLine(
    point: BABYLON.Vector3,
    orthoVec: BABYLON.Vector3
  ): void {
    const points = this.getSideLinePoints(point, orthoVec);
    if (!this.startSideLine) {
      this.startSideLine = this.createLine(
        "startSideLine",
        points,
        this.measurementLineMaterial
      );
    } else {
      this.updateLine(this.startSideLine, points);
    }
  }

  private createEndSideLine(
    point: BABYLON.Vector3,
    orthoVec: BABYLON.Vector3
  ): void {
    const points = this.getSideLinePoints(point, orthoVec);
    if (!this.endSideLine) {
      this.endSideLine = this.createLine(
        "endSideLine",
        points,
        this.measurementLineMaterial
      );
    } else {
      this.updateLine(this.endSideLine, points);
    }
  }

  private updateLine(line: BABYLON.LinesMesh, points: BABYLON.Vector3[]): void {
    BABYLON.MeshBuilder.CreateLines(
      null,
      { points, instance: line },
      this.scene
    );
  }

  private createRibbon(
    pathArray: BABYLON.Vector3[][],
    ribbonDir: BABYLON.Vector3,
    ribbonLength: number
  ): void {
    if (!this.ribbon) {
      this.ribbon = BABYLON.MeshBuilder.CreateRibbon(
        "wallRibbon",
        {
          pathArray
        },
        this.scene
      );
      this.ribbon.material = this.ribbonMaterial;
    }

    const scale = ribbonLength / WALL_THICKNESS;

    if (!isEqual(ribbonDir.z, 0)) {
      this.ribbon.scaling.z = scale;
      this.ribbon.scaling.x = 1;
    } else {
      this.ribbon.scaling.x = scale;
      this.ribbon.scaling.z = 1;
    }

    const distance = (ribbonLength - WALL_THICKNESS) * 0.5;
    this.ribbon.position = this.startPoint.add(ribbonDir.scale(distance));
  }

  private createPreRibbon(
    pathArray: BABYLON.Vector3[][],
    position: BABYLON.Vector3
  ): void {
    if (!this.preRibbon) {
      this.preRibbon = BABYLON.MeshBuilder.CreateRibbon(
        "preRibbon",
        {
          pathArray
        },
        this.scene
      );
      this.preRibbon.material = this.ribbonMaterial;
    }
    this.preRibbon.position = position;
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

  private getSnappedEndPoint(point: BABYLON.Vector3): BABYLON.Vector3 {
    const lineDir = point.subtract(this.startPoint);
    const snappedPoint = point.clone();
    const absX = Math.abs(lineDir.x);
    const absZ = Math.abs(lineDir.z);

    if (absX < absZ) {
      snappedPoint.x = this.startPoint.x;
    } else {
      snappedPoint.z = this.startPoint.z;
    }

    return snappedPoint;
  }

  public onClick(pointerInfo: BABYLON.PointerInfo): void {
    if (!this.startPoint) {
      this.onStartClick(pointerInfo);
    } else {
      this.onEndClick(pointerInfo);
    }
  }

  public onMouseMove(pointerInfo: BABYLON.PointerInfo): void {
    const groundMeshPickedPoint = this.getGroundMeshPickedPoint(pointerInfo);

    if (!this.startPoint && groundMeshPickedPoint) {
      this.createPreRibbon(this.ribbonPathArray, groundMeshPickedPoint);
    } else if (this.startPoint) {
      this.removeMesh("preRibbon", this.preRibbon);
    }

    if (!this.startPoint || !groundMeshPickedPoint) {
      return;
    }

    const snappedEndPoint = this.getSnappedEndPoint(groundMeshPickedPoint);
    const ribbonVec = snappedEndPoint.subtract(this.startPoint);
    const ribbonDir = ribbonVec.clone().normalize();
    const ribbonLength = Math.max(ribbonVec.length(), WALL_THICKNESS);
    this.createRibbon(this.ribbonPathArray, ribbonDir, ribbonLength);
    const orthoVec = getXZOrthoVec(this.startPoint, snappedEndPoint);
    const [shiftedStartPoint, shiftedEndPoint] = this.getRibbonShiftedPoints(
      [this.startPoint, snappedEndPoint],
      ribbonDir
    );
    const linePoints = this.getLinePoints(
      shiftedStartPoint,
      shiftedEndPoint,
      orthoVec
    );
    this.createMeasurementLine(linePoints);
    this.createStartSideLine(linePoints[0], orthoVec);
    this.createEndSideLine(linePoints[1], orthoVec);
    this.moveTextPlaceholderToLineMidpoint(linePoints);
    this.updateMeasurementLabel(ribbonLength);
    this.enableUI();
  }

  public dispose(): void {
    this.disposeMeasurementUI();
    this.textRectangle.dispose();
    this.textPlaceholder.dispose();
    this.disposeWalls();
  }
}
