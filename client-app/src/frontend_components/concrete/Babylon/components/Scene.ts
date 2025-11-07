import * as BABYLON from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials/grid";
import { AbstractScene, SceneOptions } from "../../../abstract/AbstractScene";
import { BACKGROUND_TEXTURE_SIZE } from "../../constants";
import {
  NO_RECURSE_DISPOSE_CAMERA,
  DISPOSE_CAMERA_MAT_AND_TEXTURES,
} from "../common/constants";
import { createBabylonArcRotateCamera } from "../factories/CameraFactory";
import { createBabylonScene } from "../factories/SceneFactory";

export class BabylonScene implements AbstractScene {
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private camera: BABYLON.TargetCamera;
  private groundMesh: BABYLON.GroundMesh;
  private isDisposed = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private sceneOptions: SceneOptions
  ) {
    this.init();
  }

  public getGroundMesh(): BABYLON.Mesh {
    return this.groundMesh;
  }

  public getUnderlyingScene(): BABYLON.Scene {
    return this.scene;
  }

  public render(): void {
    if (!this.isDisposed) {
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
    }
  }

  public dispose(): void {
    this.engine.stopRenderLoop();
    this.camera.dispose(
      NO_RECURSE_DISPOSE_CAMERA,
      DISPOSE_CAMERA_MAT_AND_TEXTURES
    );
    this.scene.dispose();
    this.engine.dispose();
    window.removeEventListener("resize", () => {
      this.engine.resize();
    });
    this.isDisposed = true;
  }

  public addOnMouseEventCallback(event: unknown): void {
    this.scene.onPointerObservable.add(
      event as (pointerInfo: BABYLON.PointerInfo) => void
    );
  }

  private onWindowResize(): void {
    this.engine.resize();
  }

  private addGradientBackground(): void {
    const gradientTexture = new BABYLON.DynamicTexture(
      "backgroundGradient",
      { width: BACKGROUND_TEXTURE_SIZE, height: BACKGROUND_TEXTURE_SIZE },
      this.scene,
      false
    );

    const textureContext = gradientTexture.getContext();
    const gradientFill = textureContext.createLinearGradient(
      0,
      0,
      0,
      BACKGROUND_TEXTURE_SIZE
    );
    gradientFill.addColorStop(0, "#3498db");
    gradientFill.addColorStop(1, "#ecf0f1");
    textureContext.fillStyle = gradientFill;
    textureContext.fillRect(
      0,
      0,
      BACKGROUND_TEXTURE_SIZE,
      BACKGROUND_TEXTURE_SIZE
    );
    gradientTexture.update();

    const layer = new BABYLON.Layer("gradientTexture", null, this.scene, true);
    layer.texture = gradientTexture;
  }

  private addGround(): void {
    this.groundMesh = BABYLON.MeshBuilder.CreateGround(
      "ground",
      {
        width: 50,
        height: 50,
      },
      this.scene
    );

    const gridMaterial = new GridMaterial("gridMaterial", this.scene);
    gridMaterial.majorUnitFrequency = 5;
    gridMaterial.minorUnitVisibility = 0.45;
    gridMaterial.gridRatio = 1;
    gridMaterial.backFaceCulling = false;
    gridMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
    gridMaterial.lineColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    gridMaterial.opacity = 1.0;
    this.groundMesh.material = gridMaterial;
  }

  private moveCameraUp(): void {
    this.camera.position = new BABYLON.Vector3(0, 20, 0);
  }

  private init(): void {
    this.engine = new BABYLON.Engine(
      this.canvas,
      this.sceneOptions.antialising
    );
    window.addEventListener("resize", () => {
      this.onWindowResize();
    });
    this.scene = createBabylonScene(this.engine);
    this.camera = createBabylonArcRotateCamera(this.scene);
    this.camera.attachControl(
      this.canvas,
      this.sceneOptions.cameraOptions.attachControlNoPreventDefault
    );
    this.moveCameraUp();
    this.addGradientBackground();
    this.addGround();
  }
}
