import {
  CreateUserDTO,
  DeleteUserDTO,
  EditUserDTO,
  ReadUserDTO,
} from "shared-types";
import { UserService } from "../business_model/UserService";
import { DatabaseMock } from "./mocks/DatabaseMock";
import {
  CAN_NOT_CHANGE_USER_EMAIL,
  PROBLEM_WITH_DATABASE,
  USER_EMAIL_NOT_VALID,
  USER_ID_NOT_UNIQUE,
  USER_PASSWORD_NOT_VALID,
  USER_WITH_SUCH_EMAIL_ALREADY_EXISTS,
  USER_WITH_SUCH_ID_NOT_FOUND,
} from "../business_model/constants";

const database = new DatabaseMock();
const userService = new UserService(database);

const dbGetAllUsersMock = jest.spyOn(database, "getAllUsers");
dbGetAllUsersMock.mockImplementation(() => database.getAllUsers());
const dbGetUserByIdMock = jest.spyOn(database, "getUserById");
dbGetUserByIdMock.mockImplementation((id: string) => database.getUserById(id));
const dbCreateUserMock = jest.spyOn(database, "createUser");
dbCreateUserMock.mockImplementation((user: CreateUserDTO) =>
  database.createUser(user)
);
const dbEditUserMock = jest.spyOn(database, "editUser");
dbEditUserMock.mockImplementation((user: EditUserDTO) =>
  database.editUser(user)
);
const dbDeleteUserMock = jest.spyOn(database, "deleteUser");
dbDeleteUserMock.mockImplementation((user: DeleteUserDTO) =>
  database.deleteUser(user)
);

const defaultMockedUser: ReadUserDTO = {
  id: "1",
  email: "JohnDoe@gmail.com",
  nickname: "JohnDoe",
};

describe("getAllUsers", () => {
  test("Should return the array of users", async () => {
    const mockedUsers: ReadUserDTO[] = [defaultMockedUser];
    dbGetAllUsersMock.mockResolvedValueOnce(mockedUsers);
    const users = await userService.getAllUsers();
    expect(users).toEqual(mockedUsers);
  });

  test("Should throw the correct error when database throws error", async () => {
    dbGetAllUsersMock.mockRejectedValueOnce(new Error("Some database error"));
    await expect(userService.getAllUsers()).rejects.toThrow(
      PROBLEM_WITH_DATABASE
    );
  });
});

describe("getUserById", () => {
  test("Should return the user", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(defaultMockedUser);
    const user = await userService.getUserById(defaultMockedUser.id);
    expect(user).toEqual(defaultMockedUser);
  });

  test("Should throw the correct error when database throws error", async () => {
    dbGetUserByIdMock.mockRejectedValueOnce(new Error("Some database error"));
    await expect(userService.getUserById("1")).rejects.toThrow(
      PROBLEM_WITH_DATABASE
    );
  });

  test("Should return null when no user found but database works correctly", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(null);
    const user = await userService.getUserById("1");
    expect(user).toBeNull();
  });
});

describe("createUser", () => {
  const mockedPassword = "password123";

  test("Should create and return correct user", async () => {
    dbGetAllUsersMock.mockResolvedValueOnce([]);
    dbCreateUserMock.mockResolvedValueOnce(defaultMockedUser);
    const user = await userService.createUser({
      ...defaultMockedUser,
      password: "password123",
    });
    expect(user).toEqual(defaultMockedUser);
  });

  test("Should throw the correct error if user with such email already exists", async () => {
    dbGetAllUsersMock.mockResolvedValueOnce([defaultMockedUser]);
    await expect(
      userService.createUser({
        ...defaultMockedUser,
        password: mockedPassword,
      })
    ).rejects.toThrow(USER_WITH_SUCH_EMAIL_ALREADY_EXISTS);
  });

  test("Should throw the correct error if user with such id already exists", async () => {
    dbGetAllUsersMock.mockResolvedValueOnce([
      {
        ...defaultMockedUser,
        email: "anotherEmail@gmail.com",
      },
    ]);
    await expect(
      userService.createUser({
        ...defaultMockedUser,
        password: mockedPassword,
      })
    ).rejects.toThrow(USER_ID_NOT_UNIQUE);
  });

  test("Should throw the correct if database throws error", async () => {
    dbCreateUserMock.mockRejectedValueOnce(new Error("Some database error"));
    await expect(
      userService.createUser({
        ...defaultMockedUser,
        password: mockedPassword,
      })
    ).rejects.toThrow(PROBLEM_WITH_DATABASE);
  });

  test("Should throw the correct error if email is not valid", async () => {
    await expect(
      userService.createUser({
        ...defaultMockedUser,
        email: "invalidEmail",
        password: mockedPassword,
      })
    ).rejects.toThrow(USER_EMAIL_NOT_VALID);
  });

  test("Should throw the correct error if password is not valid", async () => {
    await expect(
      userService.createUser({
        ...defaultMockedUser,
        password: "",
      })
    ).rejects.toThrow(USER_PASSWORD_NOT_VALID);
  });
});

describe("editUser", () => {
  test("Should return the same user if no changes are made", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(defaultMockedUser);
    dbEditUserMock.mockResolvedValueOnce(defaultMockedUser);
    const user = await userService.editUser({
      ...defaultMockedUser,
    });
    expect(user).toEqual(defaultMockedUser);
  });

  test("Should change the nickname", async () => {
    const mockedEditedUser: EditUserDTO = {
      ...defaultMockedUser,
      nickname: "NewNickname",
    };
    dbGetUserByIdMock.mockResolvedValueOnce(defaultMockedUser);
    dbEditUserMock.mockResolvedValueOnce(mockedEditedUser as ReadUserDTO);
    const user = await userService.editUser(mockedEditedUser);
    expect(user).toEqual(mockedEditedUser);
  });

  test("Should throw correct error if tried to change user email", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(defaultMockedUser);
    await expect(
      userService.editUser({
        ...defaultMockedUser,
        email: "NewEmail@gmail.com",
      })
    ).rejects.toThrow(CAN_NOT_CHANGE_USER_EMAIL);
  });

  test("Should throw correct error if user with such id has not been found", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(null);
    await expect(
      userService.editUser({
        ...defaultMockedUser
      })
    ).rejects.toThrow(USER_WITH_SUCH_ID_NOT_FOUND);
  });

  test("Should throw the correct if database throws error", async () => {
    dbGetUserByIdMock.mockRejectedValueOnce(new Error("Some database error"));
    await expect(
      userService.editUser({
        ...defaultMockedUser,
      })
    ).rejects.toThrow(PROBLEM_WITH_DATABASE);
  });
});
