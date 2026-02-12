import * as BABYLON from "@babylonjs/core";
import {
  ARC_ROTATE_CAMERA_ALPHA,
  ARC_ROTATE_CAMERA_BETA,
  ARC_ROTATE_CAMERA_RADIUS,
  ARC_ROTATE_CAMERA_TARGET
} from "../common/constants";

export const createBabylonArcRotateCamera = (
  scene: BABYLON.Scene
): BABYLON.ArcRotateCamera => {
  const camera = new BABYLON.ArcRotateCamera(
    "Camera",
    ARC_ROTATE_CAMERA_ALPHA,
    ARC_ROTATE_CAMERA_BETA,
    ARC_ROTATE_CAMERA_RADIUS,
    ARC_ROTATE_CAMERA_TARGET,
    scene
  );
  return camera;
};
