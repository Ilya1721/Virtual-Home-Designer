import { AuthToken } from "shared-types";
import { AbstractAuth } from "../../business_model/abstract/auth";
import { AuthTokenMock } from "./AuthTokenMock";

export class AuthMock implements AbstractAuth {
  public generateAccessToken(userId: string): AuthToken {
    return new AuthTokenMock();
  }

  public generateRefreshToken(userId: string): AuthToken {
    return new AuthTokenMock();
  }
}