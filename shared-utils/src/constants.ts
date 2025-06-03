export enum HttpStatus {
  OK = 200,
  INTERNAL_SERVER_ERROR = 500,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409
}

export const DB_URI_NOT_DEFINED = "Database URI is not defined";
export const USER_NOT_AUTHORIZED = "User not authorized";
export const BEARER = "Bearer ";

export const AUTHENTICATION_SERVICE_URL = "http://localhost:3000/auth";