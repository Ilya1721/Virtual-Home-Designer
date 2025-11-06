import * as BABYLON from "@babylonjs/core";
import { BabylonScene } from "./Scene";
import { AbstractConstructionMode } from "../../../abstract/AbstractConstructionMode";
import { AbstractScene } from "../../../abstract/AbstractScene";
import { WALL_THICKNESS } from "../common/constants";

export class WallMode implements AbstractConstructionMode {
  private wallMaterial: BABYLON.StandardMaterial;
  private ribbonMaterial: BABYLON.StandardMaterial;
  private lineMaterial: BABYLON.StandardMaterial;
  private startPoint: BABYLON.Vector3 | null = null;
  private lineOrthoVec: BABYLON.Vector3 | null = null;
  private ribbon: BABYLON.Mesh = null;
  private startSideLine: BABYLON.LinesMesh = null;
  private endSideLine: BABYLON.LinesMesh = null;
  private measurementLine: BABYLON.LinesMesh = null;
  private scene: BABYLON.Scene;
  private babylonScene: BabylonScene;

  constructor(scene: AbstractScene) {
    this.babylonScene = scene as BabylonScene;
    this.scene = this.babylonScene.getUnderlyingScene();
    this.prepareMaterials();
  }

  private makeMaterialOverlay(material: BABYLON.StandardMaterial): void {
    material.depthFunction = BABYLON.Constants.ALWAYS;
    material.disableDepthWrite = true;
  }

  private prepareMaterials(): void {
    this.wallMaterial = new BABYLON.StandardMaterial(
      "wallMaterial",
      this.scene
    );
    this.wallMaterial.diffuseColor = BABYLON.Color3.Gray();

    this.ribbonMaterial = new BABYLON.StandardMaterial(
      "ribbonMaterial",
      this.scene
    );
    this.ribbonMaterial.emissiveColor = BABYLON.Color3.Blue();
    this.ribbonMaterial.alpha = 0.5;
    this.makeMaterialOverlay(this.ribbonMaterial);

    this.lineMaterial = new BABYLON.StandardMaterial(
      "lineMaterial",
      this.scene
    );
    this.lineMaterial.emissiveColor = BABYLON.Color3.Purple();
    this.makeMaterialOverlay(this.lineMaterial);
  }

  private onStartClick(pointerInfo: BABYLON.PointerInfo): void {
    this.startPoint = pointerInfo.pickInfo.pickedPoint;
  }

  private onEndClick(pointerInfo: BABYLON.PointerInfo): void {
    this.removeRibbon();
    this.removeLine();
    this.removeSideLines();
    this.startPoint = null;
  }

  private getLinePoints(endPoint: BABYLON.Vector3): BABYLON.Vector3[] {
    const orthoVec = this.lineOrthoVec.scale(WALL_THICKNESS * 1.75);
    const newStartPoint = this.startPoint.add(orthoVec);
    const newEndPoint = endPoint.add(orthoVec);

    return [newStartPoint, newEndPoint];
  }

  private getSideLinePoints(point: BABYLON.Vector3): BABYLON.Vector3[] {
    const orthoVec = this.lineOrthoVec.scale(WALL_THICKNESS * 0.4);
    const sideStartPoint = point.add(orthoVec);
    const sideEndPoint = point.subtract(orthoVec);

    return [sideStartPoint, sideEndPoint];
  }

  private getRibbonPathArray(endPoint: BABYLON.Vector3): BABYLON.Vector3[][] {
    const ribbonDir = endPoint.subtract(this.startPoint);
    const orthoVec = new BABYLON.Vector3(-ribbonDir.z, 0, ribbonDir.x)
      .normalize()
      .scale(WALL_THICKNESS * 0.5);

    const path1 = [this.startPoint.add(orthoVec), endPoint.add(orthoVec)];
    const path2 = [
      this.startPoint.subtract(orthoVec),
      endPoint.subtract(orthoVec),
    ];

    return [path1, path2];
  }

  private getRibbonEndPoint(
    currentMousePoint: BABYLON.Vector3
  ): BABYLON.Vector3 {
    const finalPoint = currentMousePoint.clone();
    const testX = Math.abs(currentMousePoint.x - this.startPoint.x);
    const testZ = Math.abs(currentMousePoint.z - this.startPoint.z);
    if (testX < testZ) {
      finalPoint.x = this.startPoint.x;
      this.lineOrthoVec = new BABYLON.Vector3(-1, 0, 0);
    } else {
      finalPoint.z = this.startPoint.z;
      this.lineOrthoVec = new BABYLON.Vector3(0, 0, -1);
    }

    return finalPoint;
  }

  private createLine(points: BABYLON.Vector3[]): void {
    this.measurementLine = BABYLON.MeshBuilder.CreateLines(
      "measurementLine",
      { points, updatable: true },
      this.scene
    );
    this.measurementLine.material = this.lineMaterial;
  }

  private createSideLine(
    points: BABYLON.Vector3[],
    name: string
  ): BABYLON.LinesMesh {
    const sideLine = BABYLON.MeshBuilder.CreateLines(
      name,
      { points, updatable: true },
      this.scene
    );
    sideLine.material = this.lineMaterial;

    return sideLine;
  }

  private createStartSideLine(point: BABYLON.Vector3): void {
    const points = this.getSideLinePoints(point);
    this.startSideLine = this.createSideLine(points, "startSideLine");
  }

  private createEndSideLine(point: BABYLON.Vector3): void {
    const points = this.getSideLinePoints(point);
    this.endSideLine = this.createSideLine(points, "endSideLine");
  }

  private updateStartSideLine(point: BABYLON.Vector3): void {
    const points = this.getSideLinePoints(point);
    BABYLON.MeshBuilder.CreateLines(
      null,
      { points, instance: this.startSideLine },
      this.scene
    );
  }

  private updateEndSideLine(point: BABYLON.Vector3): void {
    const points = this.getSideLinePoints(point);
    BABYLON.MeshBuilder.CreateLines(
      null,
      { points, instance: this.endSideLine },
      this.scene
    );
  }

  private updateLine(points: BABYLON.Vector3[]): void {
    BABYLON.MeshBuilder.CreateLines(
      null,
      { points, instance: this.measurementLine },
      this.scene
    );
  }

  private createRibbon(pathArray: BABYLON.Vector3[][]): void {
    this.ribbon = BABYLON.MeshBuilder.CreateRibbon(
      "wallRibbon",
      {
        pathArray,
        updatable: true,
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
        instance: this.ribbon,
      },
      this.scene
    );
  }

  private removeRibbon(): void {
    this.scene.removeMesh(this.ribbon);
    this.ribbon.dispose();
    this.ribbon = null;
  }

  private removeLine(): void {
    this.scene.removeMesh(this.measurementLine);
    this.measurementLine.dispose();
    this.measurementLine = null;
  }

  private removeSideLines(): void {
    this.scene.removeMesh(this.startSideLine);
    this.startSideLine.dispose();
    this.startSideLine = null;
    this.scene.removeMesh(this.endSideLine);
    this.endSideLine.dispose();
    this.endSideLine = null;
  }

  private getGroundMeshPickedPoint(
    pointerInfo: BABYLON.PointerInfo
  ): BABYLON.Vector3 | null {
    const pickedObject = this.scene.pick(
      pointerInfo.event.clientX,
      pointerInfo.event.clientY
    );
    const groundMeshId = this.babylonScene.getGroundMesh().id;

    if (!pickedObject || pickedObject.pickedMesh.id !== groundMeshId) {
      return null;
    }

    return pickedObject.pickedPoint;
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
    if (!this.startPoint || !groundMeshPickedPoint) {
      return;
    }

    const endPoint = this.getRibbonEndPoint(groundMeshPickedPoint);
    const ribbonPathArray = this.getRibbonPathArray(endPoint);
    const linePoints = this.getLinePoints(endPoint);

    if (!this.ribbon) {
      this.createRibbon(ribbonPathArray);
      this.createLine(linePoints);
      this.createStartSideLine(linePoints[0]);
      this.createEndSideLine(linePoints[1]);
    } else {
      this.updateRibbon(ribbonPathArray);
      this.updateLine(linePoints);
      this.updateStartSideLine(linePoints[0]);
      this.updateEndSideLine(linePoints[1]);
    }
  }
}
