import { AuthTokenPayload, CreateUserDTO, ReadUserDTO, SignInDTO, SignUpDTO, UserRole } from "shared-types";
import { AuthMock } from "./mocks/AuthMock";
import { AuthService } from "../business_model/AuthService";
import { DatabaseMock } from "./mocks/DatabaseMock";
import * as UserManagement from "../communication/UserManagement";
import { BusinessError } from "../business_model/concrete/error";

const newUser: CreateUserDTO = {
  email: "johndoe@gmail.com",
  password: "password",
  nickname: "John Doe",
  role: UserRole.USER
};

const authTokenPayloadMock: AuthTokenPayload = {
  userId: "1",
  role: UserRole.USER
}

const authMock = new AuthMock();
const databaseMock = new DatabaseMock();
const authService = new AuthService(authMock, databaseMock);

const generateAccessTokenMock = jest.spyOn(authMock, "generateAccessToken");
const generateRefreshTokenMock = jest.spyOn(authMock, "generateRefreshToken");
const setRefreshTokenMock = jest.spyOn(databaseMock, "setRefreshToken");
const createUserMock = jest
  .spyOn(UserManagement, "createUser")
  .mockImplementation(async (user: CreateUserDTO): Promise<ReadUserDTO> => {
    return {
      id: "1",
      email: user.email,
      nickname: user.nickname,
      role: user.role,
      createdAt: new Date(),
    } as ReadUserDTO;
  });
const authenticateUserMock = jest
  .spyOn(UserManagement, "authenticateUser")
  .mockImplementation(
    async (email: string, password: string): Promise<ReadUserDTO> => {
      return {
        id: "1",
        email: email,
        nickname: "John Doe",
        role: UserRole.USER,
        createdAt: new Date(),
      } as ReadUserDTO;
    }
  );
const validateAccessTokenMock = jest
  .spyOn(authMock, "isAccessTokenValid")
  .mockImplementation(async (userId: string, token: string): Promise<boolean> => {
    return true;
  });
const validateRefreshTokenMock = jest
  .spyOn(authMock, "isRefreshTokenValid")
  .mockImplementation(async (userId: string, token: string): Promise<boolean> => {
    return true;
  });

const testAuthenticateResponse = (
  response: SignUpDTO | SignInDTO,
  user: ReadUserDTO | CreateUserDTO
) => {
  expect(response).toHaveProperty("id");
  expect(response).toHaveProperty("email", user.email);
  expect(response).toHaveProperty("nickname", user.nickname);
  expect(response).toHaveProperty("role", user.role);
  expect(response).toHaveProperty("accessToken");
  expect(response).toHaveProperty("refreshToken");

  expect(generateAccessTokenMock).toHaveBeenCalledWith(authTokenPayloadMock);
  expect(generateRefreshTokenMock).toHaveBeenCalledWith(authTokenPayloadMock);
  expect(setRefreshTokenMock).toHaveBeenCalledWith(
    response.id,
    response.refreshToken
  );
};

describe("SignUp", () => {
  test("Should return a new user with access and refresh tokens", async () => {
    const signUpResponse: SignUpDTO = await authService.signUp(newUser);
    testAuthenticateResponse(signUpResponse, newUser);
    expect(createUserMock).toHaveBeenCalledWith(newUser);
  });
});

describe("SignIn", () => {
  test("Should return an existing user with access and refresh tokens", async () => {
    const signInResponse: SignUpDTO = await authService.signIn(
      newUser.email,
      newUser.password
    );
    testAuthenticateResponse(signInResponse, newUser);
    expect(authenticateUserMock).toHaveBeenCalledWith(
      newUser.email,
      newUser.password
    );
  });
});

describe("SignOut", () => {
  test("Should set empty refresh token in the database", async () => {
    const userId = "1";
    await authService.signOut(userId);
    expect(setRefreshTokenMock).toHaveBeenCalledWith(userId, "");
  });
});

describe("isAuthenticated", () => {
  test("Should validate the access token and decide the user is authenticated", async () => {
    const userId = "1";
    const accessTokenMock = "AccessToken";
    expect(await authService.isAuthenticated(userId, accessTokenMock)).toBe(true);
    expect(validateAccessTokenMock).toHaveBeenCalledWith(userId, accessTokenMock);
  });
});

describe("refreshAccess", () => {
  test("Should throw the correct error if the refresh token is not valid", async () => {
    validateRefreshTokenMock.mockImplementationOnce(
      async (userId: string, token: string): Promise<boolean> => {
        return false;
      }
    );
    await expect(authService.refreshAccess(authTokenPayloadMock, "InvalidRefreshToken")).rejects.toThrow(
      BusinessError.INVALID_REFRESH_TOKEN
    );
  });

  test("Should successfuly generate a new access token", async () => {
    const refreshTokenMock = "RefreshToken";
    const accessToken = await authService.refreshAccess(authTokenPayloadMock, refreshTokenMock);
    expect(generateAccessTokenMock).toHaveBeenCalledWith(authTokenPayloadMock);
    expect(accessToken).not.toEqual(refreshTokenMock);
  });
});
