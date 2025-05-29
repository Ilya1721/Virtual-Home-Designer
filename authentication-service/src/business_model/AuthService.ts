import {
  CreateUserDTO,
  SignUpDTO,
  SignInDTO,
  ReadUserDTO,
  AuthTokenPayload,
} from "shared-types";
import { AbstractAuth } from "./abstract/auth";
import { AbstractDatabase } from "../database/abstract/database";
import { authenticateUser, createUser } from "../communication/UserManagement";
import { BusinessError } from "./concrete/error";

export class AuthService {
  constructor(private auth: AbstractAuth, private database: AbstractDatabase) {}

  public async signUp(user: CreateUserDTO): Promise<SignUpDTO> {
    const newUser = await createUser(user);
    return await this.getAuthData(newUser);
  }

  public async signIn(email: string, password: string): Promise<SignInDTO> {
    const user = await authenticateUser(email, password);
    return await this.getAuthData(user);
  }

  public async signOut(userId: string): Promise<void> {
    await this.database.setRefreshToken(userId, "");
  }

  public async isAuthenticated(
    userId: string,
    accessToken: string
  ): Promise<boolean> {
    return await this.auth.isAccessTokenValid(userId, accessToken);
  }

  public async refreshAccess(
    authTokenPayload: AuthTokenPayload,
    refreshToken: string
  ): Promise<string> {
    const isTokenValid = await this.auth.isRefreshTokenValid(
      authTokenPayload.userId,
      refreshToken
    );
    if (!isTokenValid) {
      throw new Error(BusinessError.INVALID_REFRESH_TOKEN);
    }
    return this.auth.generateAccessToken(authTokenPayload);
  }

  private async getAuthData(user: ReadUserDTO): Promise<SignInDTO> {
    const accessToken = this.auth.generateAccessToken({
      userId: user.id,
      role: user.role,
    });
    const refreshToken = this.auth.generateRefreshToken({
      userId: user.id,
      role: user.role,
    });
    await this.database.setRefreshToken(user.id, refreshToken);

    return {
      ...user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
