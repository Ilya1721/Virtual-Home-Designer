import { AuthTokenPayload } from "shared-types";

export interface AbstractAuth {
  generateAccessToken(authTokenPayload: AuthTokenPayload): string;
  isAccessTokenValid(userId: string, token: string): Promise<boolean>;
  generateRefreshToken(authTokenPayload: AuthTokenPayload): string;
  isRefreshTokenValid(userId: string, token: string): Promise<boolean>;
}
