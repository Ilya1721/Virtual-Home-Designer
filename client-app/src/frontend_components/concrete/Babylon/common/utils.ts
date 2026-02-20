import * as BABYLON from "@babylonjs/core";

export interface PlaneDirections {
  right: BABYLON.Vector3;
  forward: BABYLON.Vector3;
  up: BABYLON.Vector3;
}

export const getGroundPlaneDirections = (
  cameraForward: BABYLON.Vector3
): PlaneDirections => {
  const right = BABYLON.Vector3.Cross(
    BABYLON.Vector3.Up(),
    cameraForward
  ).normalize();
  const forward = new BABYLON.Vector3(-right.z, 0, right.x).normalize();
  const up = BABYLON.Vector3.Up();

  return { right, forward, up };
};

export const getSnappedGroundDirections = (
  cameraForward: BABYLON.Vector3
): PlaneDirections => {
  const groundPlaneDirections = getGroundPlaneDirections(cameraForward);
  const groundRight = groundPlaneDirections.right;
  const absX = Math.abs(groundRight.x);
  const absZ = Math.abs(groundRight.z);

  let rightDir: BABYLON.Vector3;
  if (absX > absZ) {
    rightDir = new BABYLON.Vector3(Math.sign(groundRight.x), 0, 0);
  } else {
    rightDir = new BABYLON.Vector3(0, 0, Math.sign(groundRight.z));
  }

  const forwardDir = new BABYLON.Vector3(
    -rightDir.z,
    0,
    rightDir.x
  ).normalize();

  return { right: rightDir, forward: forwardDir, up: BABYLON.Vector3.Up() };
};

export const getXZOrthoVec = (
  startPoint: BABYLON.Vector3,
  endPoint: BABYLON.Vector3
): BABYLON.Vector3 => {
  const lineDir = endPoint.subtract(startPoint).normalize();
  const orthoVec = new BABYLON.Vector3(-lineDir.z, 0, lineDir.x);
  return orthoVec;
};

export const isEqual = (
  left: number,
  right: number,
  epsilon = 1e-6
): boolean => {
  return Math.abs(right - left) < epsilon;
};
