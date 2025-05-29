import jwt from "jsonwebtoken";
import { AuthTokenPayload } from "shared-types";
import { AbstractAuth } from "../../abstract/auth";
import { AbstractDatabase } from "../../../database/abstract/database";

const jwtTokenSecret = process.env.JWT_TOKEN_SECRET || "SecretKey";
const accessTokenExpiresIn =
  Number(process.env.ACCESS_TOKEN_EXPIRES_IN_SECONDS) || 900;
const refreshTokenExpiresIn =
  Number(process.env.RERFRESH_TOKEN_EXPIRES_IN_SECONDS) || 604800;

export class JWTAuth implements AbstractAuth {
  constructor(private database: AbstractDatabase) {}

  public generateAccessToken(authTokenPayload: AuthTokenPayload): string {
    return jwt.sign(authTokenPayload, jwtTokenSecret, {
      expiresIn: accessTokenExpiresIn,
    });
  }

  public async isAccessTokenValid(
    userId: string,
    token: string
  ): Promise<boolean> {
    const authTokenPayload = await this.getAuthTokenPayload(token);
    return (
      !!authTokenPayload &&
      this.isAuthTokenPayloadValid(authTokenPayload, userId)
    );
  }

  public generateRefreshToken(authTokenPayload: AuthTokenPayload): string {
    return jwt.sign(authTokenPayload, jwtTokenSecret, {
      expiresIn: refreshTokenExpiresIn,
    });
  }

  public async isRefreshTokenValid(
    userId: string,
    token: string
  ): Promise<boolean> {
    const refreshTokenFromDB = await this.database.getRefreshToken(userId);
    if (token !== refreshTokenFromDB) return false;
    const authTokenPayload = await this.getAuthTokenPayload(token);
    return (
      !!authTokenPayload &&
      this.isAuthTokenPayloadValid(authTokenPayload, userId)
    );
  }

  private async isAuthTokenPayloadValid(
    tokenPayload: AuthTokenPayload,
    userId: string
  ): Promise<boolean> {
    return tokenPayload.userId === userId;
  }

  private async getAuthTokenPayload(
    token: string
  ): Promise<AuthTokenPayload | null> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtTokenSecret, (err, decoded) => {
        if (err || !decoded || typeof decoded === "string")
          return resolve(null);
        resolve(decoded as AuthTokenPayload);
      });
    });
  }
}
