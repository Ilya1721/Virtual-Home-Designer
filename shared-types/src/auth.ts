import { ReadUserDTO } from './user';

export interface AuthToken {
  validate(userId: string): Promise<boolean>;
  toString(): string;
}

export type SignUpDTO = ReadUserDTO & {
  accessToken: AuthToken;
  refreshToken: AuthToken;
}

export type SignInDTO = SignUpDTO & {}