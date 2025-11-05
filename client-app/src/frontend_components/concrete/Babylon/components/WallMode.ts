import * as BABYLON from "@babylonjs/core";
import { BabylonScene } from "./Scene";
import { AbstractConstructionMode } from "../../../abstract/AbstractConstructionMode";
import { AbstractScene } from "../../../abstract/AbstractScene";
import { WALL_THICKNESS } from "../common/constants";

export class WallMode implements AbstractConstructionMode {
  private wallMaterial: BABYLON.StandardMaterial;
  private ribbonMaterial: BABYLON.StandardMaterial;
  private startPoint: BABYLON.Vector3 | null = null;
  private ribbon: BABYLON.Mesh = null;
  private scene: BABYLON.Scene;
  private babylonScene: BabylonScene;

  constructor(scene: AbstractScene) {
    this.babylonScene = scene as BabylonScene;
    this.scene = this.babylonScene.getUnderlyingScene();
    this.prepareMaterials();
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
  }

  private onStartClick(pointerInfo: BABYLON.PointerInfo): void {
    this.startPoint = pointerInfo.pickInfo.pickedPoint;
  }

  private onEndClick(pointerInfo: BABYLON.PointerInfo): void {
    this.removeRibbon();
    this.startPoint = null;
  }

  private getRibbonPathArray(endPoint: BABYLON.Vector3): BABYLON.Vector3[][] {
    const ribbonDir = endPoint.subtract(this.startPoint).normalize();

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
    } else {
      finalPoint.z = this.startPoint.z;
    }

    return finalPoint;
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

    if (!this.ribbon) {
      this.createRibbon(ribbonPathArray);
    } else {
      this.updateRibbon(ribbonPathArray);
    }
  }
}
