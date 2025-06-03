import { AbstractRequest, AbstractResponse } from "shared-types";
import { HttpStatus, USER_NOT_AUTHORIZED } from "../src/constants";
import { requireAuthentication } from "../src/middleware";
import * as AuthService from "../src/services_communication/auth";

const expectUnauthorized = (
  req: AbstractRequest<unknown>,
  res: AbstractResponse<unknown, unknown>
) => {
  requireAuthentication(req, res);
  expect(res.transformErrorToJsonWithStatus).toHaveBeenCalledWith(
    HttpStatus.UNAUTHORIZED,
    { error: USER_NOT_AUTHORIZED }
  );
};

const expectAuthorized = (
  req: AbstractRequest<unknown>,
  res: AbstractResponse<unknown, unknown>
) => {
  requireAuthentication(req, res);
  expect(res.transformDataToJsonWithStatus).toHaveBeenCalledWith(
    HttpStatus.OK,
    { isAuthenticated: true }
  );
};

const isAuthenticatedMock = jest
  .spyOn(AuthService, "isAuthenticated")
  .mockImplementation(
    async (userId: string, token: string): Promise<boolean> => true
  );

describe("Authenticate user", () => {
  const res = {
    transformDataToJsonWithStatus: jest.fn(),
    transformErrorToJsonWithStatus: jest.fn(),
  } as AbstractResponse<unknown, unknown>;

  test("Should return HttpStatus.UNAUTHORIZED if authHeader is not provided", () => {
    const req = {
      authHeader: undefined,
    } as AbstractRequest<unknown>;
    expectUnauthorized(req, res);
  });

  test("Should return HttpStatus.UNAUTHORIZED if authHeader does not start with 'Bearer '", () => {
    const req = {
      authHeader: "token",
    } as AbstractRequest<unknown>;
    expectUnauthorized(req, res);
  });

  test("Should return HttpStatus.UNAUTHORIZED if authHeader does not contain auth token", () => {
    const req = {
      authHeader: "Bearer ",
      params: { id: "1" },
      body: {}
    } as AbstractRequest<unknown>;
    expectUnauthorized(req, res);
  });

  test("Should return HttpStatus.UNAUTHORIZED if authToken is not valid", () => {
    const req = {
      authHeader: "Bearer token",
      params: { id: "1" },
      body: {}
    } as AbstractRequest<unknown>;
    isAuthenticatedMock.mockResolvedValueOnce(false);
    expectUnauthorized(req, res);
  });

  test("Should return HttpStatus.Ok if authToken is valid", () => {
    const req = {
      authHeader: "Bearer token",
      params: { id: "1" },
      body: {}
    } as AbstractRequest<unknown>;
    isAuthenticatedMock.mockResolvedValueOnce(true);
    expectAuthorized(req, res);
  });
});
