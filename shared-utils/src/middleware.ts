import { AbstractRequest, AbstractResponse, UserRole } from "shared-types";
import { BEARER, HttpStatus, USER_NOT_AUTHORIZED } from "./constants";
import { isAuthenticated } from "./services_communication/auth";

export const requireAuthentication = async (
  req: AbstractRequest<unknown>,
  res: AbstractResponse<unknown, unknown>,
  allowedRoles: UserRole[] = []
): Promise<void> => {
  const authHeader = req.authHeader;
  if (!authHeader?.startsWith(BEARER)) {
    return res.transformErrorToJsonWithStatus(HttpStatus.UNAUTHORIZED, {
      error: USER_NOT_AUTHORIZED,
    });
  }

  const authToken = authHeader.split(" ")[1];
  const isUserAuthenticated = await isAuthenticated(
    req.params.id,
    authToken,
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
