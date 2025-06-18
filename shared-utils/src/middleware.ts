import { AbstractRequest, AbstractResponse, UserRole } from "shared-types";
import { BEARER, HttpStatus, USER_NOT_AUTHORIZED } from "./constants";
import { isAuthenticated } from "./services_communication/auth";

export const requireAuthentication = async (
  req: AbstractRequest<unknown>,
  res: AbstractResponse<unknown, unknown>,
  allowedRoles: UserRole[] = []
): Promise<void> => {
  let accessToken = "";
  const { authHeader } = req;

  if (authHeader && isAuthHeaderValid(authHeader)) {
    accessToken = authHeader.split(" ")[1];
  } else {
    accessToken = req.cookies.accessToken;
  }

  const isUserAuthenticated = !!accessToken && await isAuthenticated(
    req.params.id,
    accessToken,
    allowedRoles
  );

  if (!isUserAuthenticated) {
    return res.transformErrorToJsonWithStatus(HttpStatus.UNAUTHORIZED, {
      error: USER_NOT_AUTHORIZED,
    });
  }

  return res.transformDataToJsonWithStatus(HttpStatus.OK, {
    isAuthenticated: true,
  });
};

const isAuthHeaderValid = (authHeader: string): boolean => {
  return authHeader.startsWith(BEARER);
};
