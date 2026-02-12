import * as BABYLON from "@babylonjs/core";
import { AbstractConstructionMode } from "../../../abstract/AbstractConstructionMode";
import { AbstractScene } from "../../../abstract/AbstractScene";

export class ConstructionModeSelector {
  private currentMode: AbstractConstructionMode | null = null;

  constructor(private scene: AbstractScene | null) {
    this.init();
  }

  public setMode(mode: AbstractConstructionMode): void {
    this.currentMode = mode;
  }

  private init(): void {
    this.scene?.addOnMouseEventCallback((pointerInfo: BABYLON.PointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERPICK:
          this.currentMode?.onClick(pointerInfo);
          break;
        case BABYLON.PointerEventTypes.POINTERMOVE:
          this.currentMode?.onMouseMove(pointerInfo);
          break;
      }
    });
  }
}
