import { HttpStatus } from "shared-utils";

export enum BusinessError {
  PROBLEM_WITH_DATABASE = "Problem with database",
  USER_WITH_SUCH_EMAIL_ALREADY_EXISTS = "A user with such email already exists",
  USER_ID_NOT_UNIQUE = "User ID is not unique",
  USER_EMAIL_NOT_VALID = "User email is not valid",
  USER_PASSWORD_NOT_VALID = "User password is not valid",
  CAN_NOT_CHANGE_USER_EMAIL = "It's not possible to change user email",
  USER_WITH_SUCH_ID_NOT_FOUND = "User with such ID not found",
  USER_WITH_SUCH_EMAIL_OR_PASSWORD_NOT_FOUND = "User with such email or password not found",
}

export const errorHttpStatusMap: Record<BusinessError, number> = {
  [BusinessError.PROBLEM_WITH_DATABASE]: HttpStatus.INTERNAL_SERVER_ERROR,
  [BusinessError.USER_WITH_SUCH_EMAIL_ALREADY_EXISTS]: HttpStatus.BAD_REQUEST,
  [BusinessError.USER_ID_NOT_UNIQUE]: HttpStatus.BAD_REQUEST,
  [BusinessError.USER_EMAIL_NOT_VALID]: HttpStatus.BAD_REQUEST,
  [BusinessError.USER_PASSWORD_NOT_VALID]: HttpStatus.BAD_REQUEST,
  [BusinessError.CAN_NOT_CHANGE_USER_EMAIL]: HttpStatus.BAD_REQUEST,
  [BusinessError.USER_WITH_SUCH_ID_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [BusinessError.USER_WITH_SUCH_EMAIL_OR_PASSWORD_NOT_FOUND ]: HttpStatus.NOT_FOUND,
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
