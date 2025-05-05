import { AbstractScene } from "../../frontend_components/abstract/AbstractScene";

export interface GlobalContext {
  scene: AbstractScene | null;
  sceneInjection: (canvas: HTMLElement) => void;
}