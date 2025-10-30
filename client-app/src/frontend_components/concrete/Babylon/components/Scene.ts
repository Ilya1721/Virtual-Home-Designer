import * as BABYLON from "@babylonjs/core";
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
    this.addGradientBackground();
  }
}
