export interface AbstractScene {
  render: () => void;
  dispose: () => void;
}

interface CameraOptions {
  attachControlNoPreventDefault?: boolean;
}

export interface SceneOptions {
  antialising?: boolean;
  cameraOptions?: CameraOptions;
}