import {
  CreateUserDTO,
  DeleteUserDTO,
  EditUserDTO,
  FullUserDTO,
  ReadUserDTO,
  UserRole
} from "shared-types";
import { UserService } from "../business_model/UserService";
import { DatabaseMock } from "./mocks/DatabaseMock";
import { BusinessError } from "../business_model/concrete/error";
import { SafePasswordHandlerMock } from "./mocks/SafePasswordHandlerMock";

const database = new DatabaseMock();
const safePasswordHandler = new SafePasswordHandlerMock();
const userService = new UserService(database, safePasswordHandler);

const dbGetAllUsersMock = jest.spyOn(database, "getAllUsers");
dbGetAllUsersMock.mockImplementation(() => database.getAllUsers());
const dbGetUserByIdMock = jest.spyOn(database, "getUserById");
dbGetUserByIdMock.mockImplementation((id: string) => database.getUserById(id));
const dbGetUserByEmailMock = jest.spyOn(database, "getUserByEmail");
dbGetUserByEmailMock.mockImplementation((email: string) =>
  database.getUserByEmail(email)
);
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
const isPasswordEqualMock = jest.spyOn(safePasswordHandler, "isEqual");
const getSafePasswordMock = jest.spyOn(safePasswordHandler, "getSafeString");

jest.spyOn(console, "error").mockImplementation(() => {});

const defaultMockedUser: ReadUserDTO = {
  id: "1",
  email: "JohnDoe@gmail.com",
  nickname: "JohnDoe",
  role: UserRole.USER,
  createdAt: new Date()
};

const fullMockedUser: FullUserDTO = {
  ...defaultMockedUser,
  password: "password"
};

const userWithPassword: any = {
  ...defaultMockedUser,
  password: "password"
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
      BusinessError.PROBLEM_WITH_DATABASE
    );
  });

  test("Should return users with exactly the same properties as ReadUserDTO", async () => {
    dbGetAllUsersMock.mockResolvedValueOnce([userWithPassword]);
    const users = await userService.getAllUsers();
    users.forEach((user) => {
      expect(user).not.toHaveProperty("password");
    });
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
      BusinessError.PROBLEM_WITH_DATABASE
    );
  });

  test("Should return null when no user found but database works correctly", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(null);
    const user = await userService.getUserById("1");
    expect(user).toBeNull();
  });

  test("Should return users with exactly the same properties as ReadUserDTO", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(userWithPassword);
    const user = await userService.getUserById("1");
    expect(user).not.toHaveProperty("password");
  });
});

describe("createUser", () => {
  const mockedPassword = "password123";

  test("Should create and return correct user", async () => {
    dbGetAllUsersMock.mockResolvedValueOnce([]);
    dbCreateUserMock.mockResolvedValueOnce(defaultMockedUser);
    const user = await userService.createUser(userWithPassword);
    expect(user).toEqual(defaultMockedUser);
    expect(getSafePasswordMock).toHaveBeenCalled();
  });

  test("Should throw the correct error if user with such email already exists", async () => {
    dbGetAllUsersMock.mockResolvedValueOnce([defaultMockedUser]);
    await expect(
      userService.createUser({
        ...defaultMockedUser,
        password: mockedPassword
      })
    ).rejects.toThrow(BusinessError.USER_WITH_SUCH_EMAIL_ALREADY_EXISTS);
  });

  test("Should throw the correct error if database throws error", async () => {
    dbGetAllUsersMock.mockResolvedValueOnce([]);
    dbCreateUserMock.mockRejectedValueOnce(new Error("Some database error"));
    await expect(
      userService.createUser({
        ...defaultMockedUser,
        password: mockedPassword
      })
    ).rejects.toThrow(BusinessError.PROBLEM_WITH_DATABASE);
  });

  test("Should throw the correct error if email is not valid", async () => {
    await expect(
      userService.createUser({
        ...defaultMockedUser,
        email: "invalidEmail",
        password: mockedPassword
      })
    ).rejects.toThrow(BusinessError.USER_EMAIL_NOT_VALID);
  });

  test("Should throw the correct error if password is not valid", async () => {
    await expect(
      userService.createUser({
        ...defaultMockedUser,
        password: ""
      })
    ).rejects.toThrow(BusinessError.USER_PASSWORD_NOT_VALID);
  });

  test("Should return users with exactly the same properties as ReadUserDTO", async () => {
    dbGetAllUsersMock.mockResolvedValueOnce([]);
    dbCreateUserMock.mockResolvedValueOnce(userWithPassword);
    const user = await userService.createUser(userWithPassword);
    expect(user).not.toHaveProperty("password");
  });
});

describe("editUser", () => {
  test("Should return the same user if no changes are made", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(defaultMockedUser);
    dbEditUserMock.mockResolvedValueOnce(defaultMockedUser);
    const user = await userService.editUser({
      ...defaultMockedUser
    });
    expect(user).toEqual(defaultMockedUser);
  });

  test("Should change the nickname", async () => {
    const mockedEditedUser: ReadUserDTO = {
      ...defaultMockedUser,
      nickname: "NewNickname"
    };
    dbGetUserByIdMock.mockResolvedValueOnce(defaultMockedUser);
    dbEditUserMock.mockResolvedValueOnce(mockedEditedUser as ReadUserDTO);
    const user = await userService.editUser(mockedEditedUser as EditUserDTO);
    expect(user).toEqual(mockedEditedUser);
  });

  test("Should throw correct error if tried to change user email", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(defaultMockedUser);
    await expect(
      userService.editUser({
        ...defaultMockedUser,
        email: "NewEmail@gmail.com"
      })
    ).rejects.toThrow(BusinessError.CAN_NOT_CHANGE_USER_EMAIL);
  });

  test("Should throw correct error if user with such id has not been found", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(null);
    await expect(
      userService.editUser({
        ...defaultMockedUser
      })
    ).rejects.toThrow(BusinessError.USER_WITH_SUCH_ID_NOT_FOUND);
  });

  test("Should throw the correct error if database throws error", async () => {
    dbGetUserByIdMock.mockRejectedValueOnce(new Error("Some database error"));
    await expect(
      userService.editUser({
        ...defaultMockedUser
      })
    ).rejects.toThrow(BusinessError.PROBLEM_WITH_DATABASE);
  });

  test("Should return users with exactly the same properties as ReadUserDTO", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(userWithPassword);
    dbEditUserMock.mockResolvedValueOnce(userWithPassword as ReadUserDTO);
    const user = await userService.editUser(userWithPassword as EditUserDTO);
    expect(user).not.toHaveProperty("password");
  });
});

describe("deleteUser", () => {
  test("Should delete the user", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(defaultMockedUser);
    dbDeleteUserMock.mockResolvedValueOnce(undefined);
    await userService.deleteUser({
      ...defaultMockedUser
    });
    expect(dbDeleteUserMock).toHaveBeenCalled();
  });

  test("Should throw correct error if user with such id has not been found", async () => {
    dbGetUserByIdMock.mockResolvedValueOnce(null);
    await expect(
      userService.deleteUser({
        ...defaultMockedUser
      })
    ).rejects.toThrow(BusinessError.USER_WITH_SUCH_ID_NOT_FOUND);
  });

  test("Should throw the correct error if database throws error", async () => {
    dbGetUserByIdMock.mockRejectedValueOnce(new Error("Some database error"));
    await expect(
      userService.deleteUser({
        ...defaultMockedUser
      })
    ).rejects.toThrow(BusinessError.PROBLEM_WITH_DATABASE);
  });
});

describe("authenticateUser", () => {
  test("Should throw the correct error if a user with such email not found", async () => {
    dbGetUserByEmailMock.mockResolvedValueOnce(null);
    await expect(
      userService.authenticateUser(
        fullMockedUser.email,
        fullMockedUser.password
      )
    ).rejects.toThrow(BusinessError.USER_WITH_SUCH_EMAIL_OR_PASSWORD_NOT_FOUND);
  });

  test("Should throw the correct error if database throws error", async () => {
    dbGetUserByEmailMock.mockRejectedValueOnce(
      new Error("Some database error")
    );
    await expect(
      userService.authenticateUser(
        fullMockedUser.email,
        fullMockedUser.password
      )
    ).rejects.toThrow(BusinessError.PROBLEM_WITH_DATABASE);
  });

  test("Should throw the correct error if password is wrong", async () => {
    dbGetUserByEmailMock.mockResolvedValueOnce(fullMockedUser);
    await expect(
      userService.authenticateUser(fullMockedUser.email, "wrongPassword")
    ).rejects.toThrow(BusinessError.USER_WITH_SUCH_EMAIL_OR_PASSWORD_NOT_FOUND);
  });

  test("Should return the user", async () => {
    dbGetUserByEmailMock.mockResolvedValueOnce(fullMockedUser);
    await expect(
      userService.authenticateUser(
        fullMockedUser.email,
        fullMockedUser.password
      )
    ).resolves.toEqual(defaultMockedUser);
    expect(isPasswordEqualMock).toHaveBeenCalled();
  });

  test("Should return users with exactly the same properties as ReadUserDTO", async () => {
    dbGetUserByEmailMock.mockResolvedValueOnce(fullMockedUser);
    const authenticatedUser = await userService.authenticateUser(
      fullMockedUser.email,
      fullMockedUser.password
    );
    expect(authenticatedUser).not.toHaveProperty("password");
  });
});
