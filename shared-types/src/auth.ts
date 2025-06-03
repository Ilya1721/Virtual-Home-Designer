import { ReadUserDTO } from "./user";

export type SignUpDTO = ReadUserDTO & {
  accessToken: string;
  refreshToken: string;
};

export type SignInDTO = SignUpDTO & {};

export enum UserRole {
  USER = "User",
  ADMIN = "Admin",
}

export type AuthTokenPayload = {
  userId: string;
  role: UserRole;
};

export type IsAuthenticatedReqDTO = {
  accessToken: string;
  allowedRoles: UserRole[];
};

export type RefreshAccessReqDTO = {
  userId: string;
  refreshToken: string;
};

export type RefreshAccessResDTO = {
  accessToken: string;
};
