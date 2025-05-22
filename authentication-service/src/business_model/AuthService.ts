import { CreateUserDTO, SignUpDTO, SignInDTO, AuthToken, ReadUserDTO } from "shared-types";
import { AbstractAuth } from "./abstract/auth";
import { AbstractDatabase } from "../database/abstract/database";
import { authenticateUser, createUser } from "../communication/UserManagement";
import { EmptyAuthToken } from "./concrete/auth";
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
    await this.database.setRefreshToken(userId, new EmptyAuthToken());
  }

  public async isAuthenticated(userId: string, accessToken: AuthToken): Promise<boolean> {
    return await accessToken.validate(userId);
  }

  public async refreshAccess(userId: string, refreshToken: AuthToken): Promise<AuthToken> {
    const isTokenValid = await refreshToken.validate(userId);
    if (!isTokenValid) {
      throw new Error(BusinessError.INVALID_REFRESH_TOKEN);
    }

    return this.auth.generateAccessToken(userId);
  }

  private async getAuthData(user: ReadUserDTO): Promise<SignInDTO> {
    const accessToken = this.auth.generateAccessToken(user.id);
    const refreshToken = this.auth.generateRefreshToken(user.id);
    await this.database.setRefreshToken(user.id, refreshToken);

    return {
      ...user,
      accessToken: accessToken,
      refreshToken: refreshToken
    };
  }
}
