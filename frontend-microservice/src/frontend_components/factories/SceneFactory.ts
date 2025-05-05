import { AbstractScene, SceneOptions } from "../abstract/AbstractScene";
import { BabylonScene } from "../concrete/Babylon/components/Scene";

export const createBabylonScene = (
  canvas: HTMLCanvasElement,
  sceneOptions: SceneOptions
): AbstractScene => {
  return new BabylonScene(canvas, sceneOptions);
}