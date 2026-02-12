import { AbstractRequest, AbstractResponse, HttpStatus } from "shared-types";
import { USER_NOT_AUTHORIZED } from "../src/constants";
import { requireAuthentication } from "../src/middleware";
import * as AuthService from "../src/services_communication/auth";

const expectUnauthorized = async (
  req: AbstractRequest<unknown>,
  res: AbstractResponse<unknown, unknown>
) => {
  await requireAuthentication(req, res);
  expect(res.transformErrorToJsonWithStatus).toHaveBeenCalledWith(
    HttpStatus.UNAUTHORIZED,
    { error: USER_NOT_AUTHORIZED }
  );
};

const expectAuthorized = async (
  req: AbstractRequest<unknown>,
  res: AbstractResponse<unknown, unknown>
) => {
  await requireAuthentication(req, res);
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
    cookie: jest.fn()
  } as AbstractResponse<unknown, unknown>;

  test("Should return HttpStatus.UNAUTHORIZED if neither authHeader nor cookie is provided", async () => {
    const req = {
      authHeader: undefined,
      cookies: {}
    } as AbstractRequest<unknown>;
    await expectUnauthorized(req, res);
  });

  test("Should return HttpStatus.UNAUTHORIZED if authHeader does not start with 'Bearer '", async () => {
    const req = {
      authHeader: "token",
      cookies: {}
    } as AbstractRequest<unknown>;
    await expectUnauthorized(req, res);
  });

  test("Should return HttpStatus.UNAUTHORIZED if token from auth header is empty", async () => {
    const req = {
      authHeader: "Bearer ",
      params: { id: "1" },
      cookies: {},
      body: {}
    } as AbstractRequest<unknown>;
    await expectUnauthorized(req, res);
  });

  test("Should return HttpStatus.UNAUTHORIZED if token from cookie is empty", async () => {
    const req = {
      authHeader: undefined,
      params: { id: "1" },
      cookies: { accessToken: "" },
      body: {}
    } as AbstractRequest<unknown>;
    await expectUnauthorized(req, res);
  });

  test("Should return HttpStatus.UNAUTHORIZED if token from cookie is not valid", async () => {
    const req = {
      authHeader: undefined,
      params: { id: "1" },
      cookies: { accessToken: "token" },
      body: {}
    } as AbstractRequest<unknown>;
    isAuthenticatedMock.mockResolvedValueOnce(false);
    await expectUnauthorized(req, res);
  });

  test("Should return HttpStatus.UNAUTHORIZED if token from auth header is not valid", async () => {
    const req = {
      authHeader: "Bearer token",
      params: { id: "1" },
      cookies: {},
      body: {}
    } as AbstractRequest<unknown>;
    isAuthenticatedMock.mockResolvedValueOnce(false);
    expectUnauthorized(req, res);
  });

  test("Should return HttpStatus.Ok if only access token from auth header is valid", async () => {
    const req = {
      authHeader: "Bearer token",
      params: { id: "1" },
      cookies: {},
      body: {}
    } as AbstractRequest<unknown>;
    isAuthenticatedMock.mockResolvedValueOnce(true);
    await expectAuthorized(req, res);
  });

  test("Should return HttpStatus.Ok if only access token from cookie is valid", async () => {
    const req = {
      authHeader: undefined,
      params: { id: "1" },
      cookies: { accessToken: "token" },
      body: {}
    } as AbstractRequest<unknown>;
    isAuthenticatedMock.mockResolvedValueOnce(true);
    await expectAuthorized(req, res);
  });

  test("Should return HttpStatus.Ok if tokens from both places are valid", async () => {
    const req = {
      authHeader: "Bearer token",
      params: { id: "1" },
      cookies: { accessToken: "token" },
      body: {}
    } as AbstractRequest<unknown>;
    isAuthenticatedMock.mockResolvedValueOnce(true);
    await expectAuthorized(req, res);
  });
});
