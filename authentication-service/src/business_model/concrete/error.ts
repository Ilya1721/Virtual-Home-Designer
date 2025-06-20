import { HttpStatus } from "shared-utils";

export enum BusinessError {
  INVALID_REFRESH_TOKEN = "Invalid refresh token",
  TOKEN_IS_INVALID = "Token is invalid",
}

export const errorHttpStatusMap: Record<BusinessError, number> = {
  [BusinessError.INVALID_REFRESH_TOKEN]: HttpStatus.UNAUTHORIZED,
  [BusinessError.TOKEN_IS_INVALID]: HttpStatus.UNAUTHORIZED,
};

export const getHttpStatusByError = (error: unknown): number => {
  if (error instanceof Error) {
    return (
      errorHttpStatusMap[error.message as BusinessError] ||
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
  return HttpStatus.INTERNAL_SERVER_ERROR;
};
