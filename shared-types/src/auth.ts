export enum UserRole {
  USER = "User",
  ADMIN = "Admin",
}

export type AuthTokenPayload = {
  userId: string;
  role: UserRole;
};

export type IsAuthenticatedReqDTO = {
  allowedRoles: UserRole[];
  accessToken: string;
};
