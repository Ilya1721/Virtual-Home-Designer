import { AuthToken, CreateUserDTO, SignInDTO, SignUpDTO } from "shared-types";

export interface AbstractDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  setRefreshToken(userId: string, refreshToken: AuthToken): Promise<void>;
  getRefreshToken(userId: string): Promise<AuthToken | null>;
}