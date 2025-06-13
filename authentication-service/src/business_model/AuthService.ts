import {
  CreateUserDTO,
  SignUpDTO,
  SignInDTO,
  ReadUserDTO,
  AuthTokenPayload,
  UserRole,
} from "shared-types";
import { AbstractAuth } from "./abstract/auth";
import { AbstractDatabase } from "../database/abstract/database";
import {
  authenticateUser,
  createUser,
} from "../services_communication/UserManagement";
import { BusinessError } from "./concrete/error";
import { toReadUserDTO } from "shared-utils";

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
    accessToken: string,
    allowedRoles: UserRole[]
  ): Promise<boolean> {
    const authTokenPayload = await this.auth.getTokenPayload(accessToken);
    if (!this.isAuthTokenPayloadValid(authTokenPayload, userId)) {
      return false;
    }
    return !allowedRoles.length
      ? true
      : allowedRoles.includes(authTokenPayload!.role);
  }

  public async refreshAccess(
    userId: string,
    refreshToken: string
  ): Promise<string> {
    const authTokenPayload = await this.auth.getTokenPayload(refreshToken);
    const refreshTokenFromDB = await this.database.getRefreshToken(userId);
    if (
      !this.isAuthTokenPayloadValid(authTokenPayload, userId) ||
      refreshToken !== refreshTokenFromDB
    ) {
      throw new Error(BusinessError.INVALID_REFRESH_TOKEN);
    }
    return this.auth.generateAccessToken(authTokenPayload!);
  }

  private isAuthTokenPayloadValid(
    tokenPayload: AuthTokenPayload | null,
    userId: string
  ): boolean {
    return tokenPayload?.userId === userId;
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
      ...toReadUserDTO(user),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
