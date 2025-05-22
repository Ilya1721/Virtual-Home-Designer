import { CreateUserDTO, ReadUserDTO, SignInDTO, SignUpDTO } from "shared-types";
import { AuthMock } from "./mocks/AuthMock";
import { AuthService } from "../business_model/AuthService";
import { DatabaseMock } from "./mocks/DatabaseMock";
import * as UserManagement from "../communication/UserManagement";
import { EmptyAuthToken } from "../business_model/concrete/auth";
import { AuthTokenMock } from "./mocks/AuthTokenMock";
import { BusinessError } from "../business_model/concrete/error";

const newUser: CreateUserDTO = {
  email: "johndoe@gmail.com",
  password: "password",
  nickname: "John Doe",
};

const authMock = new AuthMock();
const databaseMock = new DatabaseMock();
const authService = new AuthService(authMock, databaseMock);
const authTokenMock = new AuthTokenMock();

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
        createdAt: new Date(),
      } as ReadUserDTO;
    }
  );
const validateAuthTokenMock = jest
  .spyOn(authTokenMock, "validate")
  .mockImplementation(async (userId: string): Promise<boolean> => {
    return true;
  });

const testAuthenticateResponse = (
  response: SignUpDTO | SignInDTO,
  user: ReadUserDTO | CreateUserDTO
) => {
  expect(response).toHaveProperty("id");
  expect(response).toHaveProperty("email", user.email);
  expect(response).toHaveProperty("nickname", user.nickname);
  expect(response).toHaveProperty("accessToken");
  expect(response).toHaveProperty("refreshToken");

  expect(generateAccessTokenMock).toHaveBeenCalledWith(response.id);
  expect(generateRefreshTokenMock).toHaveBeenCalledWith(response.id);
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
    expect(setRefreshTokenMock).toHaveBeenCalledWith(
      userId,
      expect.any(EmptyAuthToken)
    );
  });
});

describe("isAuthenticated", () => {
  test("Should decide the user is validated and call authToken validate to check it", async () => {
    const userId = "1";
    expect(await authService.isAuthenticated(userId, authTokenMock)).toBe(true);
    expect(validateAuthTokenMock).toHaveBeenCalledWith(userId);
  });
});

describe("refreshAccess", () => {
  test("Should throw the correct error if the refresh token is not valid", async () => {
    validateAuthTokenMock.mockImplementationOnce(
      async (userId: string): Promise<boolean> => {
        return false;
      }
    );
    await expect(authService.refreshAccess("1", authTokenMock)).rejects.toThrow(
      BusinessError.INVALID_REFRESH_TOKEN
    );
  });

  test("Should throw the correct error if the refresh token is not valid", async () => {
    const userId = "1";
    const accessToken = await authService.refreshAccess(userId, authTokenMock);
    expect(generateAccessTokenMock).toHaveBeenCalledWith(userId);
    expect(accessToken).not.toEqual(authTokenMock);
  });
});
