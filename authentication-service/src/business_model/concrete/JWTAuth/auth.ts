import jwt from "jsonwebtoken";
import { AuthTokenPayload } from "shared-types";
import { AbstractAuth } from "../../abstract/auth";

const jwtTokenSecret = process.env.JWT_TOKEN_SECRET || "SecretKey";
const accessTokenExpiresIn = Number(
  process.env.ACCESS_TOKEN_EXPIRES_IN_SECONDS
);
const refreshTokenExpiresIn = Number(
  process.env.RERFRESH_TOKEN_EXPIRES_IN_SECONDS
);

export class JWTAuth implements AbstractAuth {
  constructor() {}

  public generateAccessToken(authTokenPayload: AuthTokenPayload): string {
    return jwt.sign(authTokenPayload, jwtTokenSecret, {
      expiresIn: accessTokenExpiresIn
    });
  }

  public generateRefreshToken(authTokenPayload: AuthTokenPayload): string {
    return jwt.sign(authTokenPayload, jwtTokenSecret, {
      expiresIn: refreshTokenExpiresIn
    });
  }

  public async getTokenPayload(
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
