import { HttpStatus } from "shared-types";

export enum BusinessError {
  PROBLEM_WITH_DATABASE = "Problem with database"
}

export const errorHttpStatusMap: Record<BusinessError, number> = {
  [BusinessError.PROBLEM_WITH_DATABASE]: HttpStatus.INTERNAL_SERVER_ERROR,
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
