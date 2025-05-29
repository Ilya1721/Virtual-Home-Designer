import { AuthTokenPayload } from "shared-types";
import { AbstractAuth } from "../../business_model/abstract/auth";

export class AuthMock implements AbstractAuth {
  public generateAccessToken(authTokenPayload: AuthTokenPayload): string {
    return "";
  }

  public async isAccessTokenValid(userId: string, token: string): Promise<boolean> {
    return true;
  }

  public generateRefreshToken(authTokenPayload: AuthTokenPayload): string {
    return "";
  }

  public async isRefreshTokenValid(userId: string, token: string): Promise<boolean> {
    return true;
  }
}