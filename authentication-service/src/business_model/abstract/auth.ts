import { AuthToken } from "shared-types";

export interface AbstractAuth {
  generateAccessToken(userId: string): AuthToken;
  generateRefreshToken(userId: string): AuthToken;
}
