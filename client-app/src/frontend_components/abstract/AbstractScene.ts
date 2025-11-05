export interface AbstractScene {
  render: () => void;
  dispose: () => void;
  addOnMouseEventCallback: (event: unknown) => void;
  getGroundMesh: () => unknown;
  getUnderlyingScene: () => unknown;
}

interface CameraOptions {
  attachControlNoPreventDefault?: boolean;
}

export interface SceneOptions {
  antialising?: boolean;
  cameraOptions?: CameraOptions;
}