import { AuthToken } from "shared-types";

export class EmptyAuthToken implements AuthToken {
  public async validate(): Promise<boolean> {
    return false;
  }

  public toString(): string {
    return "";
  }
}