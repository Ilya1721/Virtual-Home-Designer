import { AuthToken } from "shared-types";

export class AuthTokenMock implements AuthToken {
  public async validate(userId: string): Promise<boolean> {
    return true;
  }
}