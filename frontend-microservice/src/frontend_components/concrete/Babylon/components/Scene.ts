import * as BABYLON from "@babylonjs/core";
import { AbstractScene, SceneOptions } from "../../../abstract/AbstractScene";
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

  constructor(
    private canvas: HTMLCanvasElement,
    private sceneOptions: SceneOptions
  ) {
    this.init();
  }

  public render(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
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
  }

  private onWindowResize(): void {
    this.engine.resize();
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
  }
}
