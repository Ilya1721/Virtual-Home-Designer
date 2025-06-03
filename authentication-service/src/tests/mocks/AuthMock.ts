import { AuthTokenPayload, UserRole } from "shared-types";
import { AbstractAuth } from "../../business_model/abstract/auth";

export class AuthMock implements AbstractAuth {
  public generateAccessToken(authTokenPayload: AuthTokenPayload): string {
    return "";
  }

  public generateRefreshToken(authTokenPayload: AuthTokenPayload): string {
    return "";
  }

  public async getTokenPayload(token: string): Promise<AuthTokenPayload | null> {
    return {
      userId: "1",
      role: UserRole.USER,
    };
  }
}