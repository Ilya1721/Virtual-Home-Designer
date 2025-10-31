import { AbstractConstructionMode } from "../../../abstract/AbstractConstructionMode";

export class WallMode implements AbstractConstructionMode {
  public onClick(): void {
    console.log("WallMode onClick");
  }

  public onMouseMove(): void {
    console.log("WallMode onMouseMove");
  }
}