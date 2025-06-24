import { ReadUserDTO } from "shared-types";
import { AbstractScene } from "../../frontend_components/abstract/AbstractScene";

export interface GlobalContext {
  scene: AbstractScene | null;
  user: ReadUserDTO | null;
  setUser: (user: ReadUserDTO | null) => void;
  sceneInjection: (canvas: HTMLElement) => void;
}