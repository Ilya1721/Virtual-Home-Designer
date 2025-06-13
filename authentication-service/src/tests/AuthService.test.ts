import {
  AuthTokenPayload,
  CreateUserDTO,
  ReadUserDTO,
  SignInDTO,
  SignUpDTO,
  UserRole,
} from "shared-types";
import { AuthMock } from "./mocks/AuthMock";
import { AuthService } from "../business_model/AuthService";
import { DatabaseMock } from "./mocks/DatabaseMock";
import * as UserManagement from "../services_communication/UserManagement";
import { BusinessError } from "../business_model/concrete/error";

const newUser: CreateUserDTO = {
  email: "johndoe@gmail.com",
  password: "password",
  nickname: "John Doe",
  role: UserRole.USER,
};

const authTokenPayloadMock: AuthTokenPayload = {
  userId: "1",
  role: UserRole.USER,
};

const validRefreshToken = "ValidRefreshToken";

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
const getTokenPayloadMock = jest
  .spyOn(authMock, "getTokenPayload")
  .mockImplementation(
    async (token: string): Promise<AuthTokenPayload | null> => {
      return authTokenPayloadMock;
    }
  );
const getRefreshTokenMock = jest
  .spyOn(databaseMock, "getRefreshToken")
  .mockImplementation(async (userId: string): Promise<string> => {
    return validRefreshToken;
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

  test("Should return data with exactly the same properties as ReadUserDTO", async () => {
    createUserMock.mockImplementationOnce(
      async (user: CreateUserDTO): Promise<ReadUserDTO> => {
        return {
          ...user,
          password: "password",
        } as any;
      }
    );
    const signUpResponse = await authService.signUp(newUser);
    expect(signUpResponse).not.toHaveProperty("password");
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

  test("Should return data with exactly the same properties as ReadUserDTO", async () => {
    authenticateUserMock.mockImplementationOnce(
      async (email: string, password: string): Promise<ReadUserDTO> => {
        return {
          id: "1",
          email: email,
          nickname: "John Doe",
          role: UserRole.USER,
          createdAt: new Date(),
          password: "password",
        } as any;
      }
    );
    const signInResponse: SignUpDTO = await authService.signIn(
      newUser.email,
      newUser.password
    );
    expect(signInResponse).not.toHaveProperty("password");
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
  test("Should return false if token is invalid", async () => {
    getTokenPayloadMock.mockResolvedValueOnce(null);
    const isAuthenticated = await authService.isAuthenticated(
      authTokenPayloadMock.userId,
      "InvalidToken",
      []
    );
    expect(isAuthenticated).toBe(false);
  });

  test("Should return false if the token belongs to other user", async () => {
    const isAuthenticated = await authService.isAuthenticated(
      "OtherUserId",
      "Token",
      []
    );
    expect(isAuthenticated).toBe(false);
  });

  test("Should return false if the user doesn't have a required role", async () => {
    const isAuthenticated = await authService.isAuthenticated(
      authTokenPayloadMock.userId,
      "Token",
      [UserRole.ADMIN]
    );
    expect(isAuthenticated).toBe(false);
  });

  test("Should return true if the token is valid and the user has the required role", async () => {
    const isAuthenticated = await authService.isAuthenticated(
      authTokenPayloadMock.userId,
      "Token",
      [UserRole.USER]
    );
    expect(isAuthenticated).toBe(true);
  });

  test("Should return true if the token is valid and any role is allowed", async () => {
    const isAuthenticated = await authService.isAuthenticated(
      authTokenPayloadMock.userId,
      "Token",
      []
    );
    expect(isAuthenticated).toBe(true);
  });
});

describe("refreshAccess", () => {
  test("Should throw the correct error if the refresh token is not valid", async () => {
    getTokenPayloadMock.mockResolvedValueOnce(null);
    await expect(
      authService.refreshAccess(
        authTokenPayloadMock.userId,
        "InvalidRefreshToken"
      )
    ).rejects.toThrow(BusinessError.INVALID_REFRESH_TOKEN);
  });

  test("Should throw the correct error if the token belongs to other user", async () => {
    await expect(
      authService.refreshAccess("otherUserId", "InvalidRefreshToken")
    ).rejects.toThrow(BusinessError.INVALID_REFRESH_TOKEN);
  });

  test("Should throw the correct error if the token is not the same as in the Database", async () => {
    await expect(
      authService.refreshAccess(
        authTokenPayloadMock.userId,
        "DifferentRefreshToken"
      )
    ).rejects.toThrow(BusinessError.INVALID_REFRESH_TOKEN);
  });

  test("Should successfuly generate a new access token", async () => {
    const accessToken = await authService.refreshAccess(
      authTokenPayloadMock.userId,
      validRefreshToken
    );
    expect(generateAccessTokenMock).toHaveBeenCalledWith(authTokenPayloadMock);
    expect(accessToken).not.toEqual(validRefreshToken);
  });
});
