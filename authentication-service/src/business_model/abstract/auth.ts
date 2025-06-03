import { AuthTokenPayload, UserRole } from "shared-types";

export interface AbstractAuth {
  generateAccessToken(authTokenPayload: AuthTokenPayload): string;
  generateRefreshToken(authTokenPayload: AuthTokenPayload): string;
  getTokenPayload(token: string): Promise<AuthTokenPayload | null>;
}
