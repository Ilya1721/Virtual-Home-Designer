import { AuthTokenPayload, ReadUserDTO } from "shared-types";

export type SignUpDTO = {
  accessToken: string;
  refreshToken: string;
  user: ReadUserDTO;
};

export type SignInDTO = SignUpDTO & {};

export interface AbstractAuth {
  generateAccessToken(authTokenPayload: AuthTokenPayload): string;
  generateRefreshToken(authTokenPayload: AuthTokenPayload): string;
  getTokenPayload(token: string): Promise<AuthTokenPayload | null>;
}
