import * as BABYLON from "@babylonjs/core";

export const createBabylonScene = (engine: BABYLON.Engine) => {
  const scene = new BABYLON.Scene(engine);
  return scene;
}