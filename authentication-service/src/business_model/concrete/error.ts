import { HttpStatus } from "shared-utils";

export enum BusinessError {
  INVALID_REFRESH_TOKEN = "Invalid refresh token",
  INVALID_ACCESS_TOKEN = "Invalid access token",
}

export const errorHttpStatusMap: Record<BusinessError, number> = {
  [BusinessError.INVALID_REFRESH_TOKEN]: HttpStatus.LOGIN_TIMEOUT,
  [BusinessError.INVALID_ACCESS_TOKEN]: HttpStatus.UNAUTHORIZED,
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
