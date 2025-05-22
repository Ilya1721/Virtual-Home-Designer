import {
  CreateUserDTO,
  DeleteUserDTO,
  EditUserDTO,
  FullUserDTO,
  ReadUserDTO,
} from "shared-types";
import { AbstractDatabase } from "../database/abstract/database";
import { BusinessError } from "./concrete/error";
import { SafePasswordHandler } from "./abstract/password";
import { AuthenticationValidator } from "./concrete/validation/AuthenticationValidator";
import { CreateUserValidator } from "./concrete/validation/CreateUserValidator";
import { DeleteUserValidator } from "./concrete/validation/DeleteUserValidator";
import { EditUserValidator } from "./concrete/validation/EditUserValidator";

export class UserService {
  constructor(
    private database: AbstractDatabase,
    private safePasswordHandler: SafePasswordHandler
  ) {}

  public async getAllUsers(): Promise<ReadUserDTO[]> {
    try {
      return await this.database.getAllUsers();
    } catch (error) {
      console.error("Error fetching all users", error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }
  }

  public async getUserById(id: string): Promise<ReadUserDTO | null> {
    try {
      return await this.database.getUserById(id);
    } catch (error) {
      console.error(`Error fetching user by ID: ${id}`, error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }
  }

  public async createUser(user: CreateUserDTO): Promise<ReadUserDTO> {
    const validator = new CreateUserValidator(user, this.database);
    await validator.validate();

    user.password = await this.safePasswordHandler.getSafeString(user.password);

    try {
      return await this.database.createUser(user);
    } catch (error) {
      console.error("Error creating user", error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }
  }

  public async editUser(user: EditUserDTO): Promise<ReadUserDTO | null> {
    const validator = new EditUserValidator(user, this.database);
    await validator.validate();

    try {
      return await this.database.editUser(user);
    } catch (error) {
      console.error("Error editing user", error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }
  }

  public async deleteUser(user: DeleteUserDTO): Promise<void> {
    const validator = new DeleteUserValidator(user, this.database);
    await validator.validate();

    try {
      await this.database.deleteUser(user);
    } catch (error) {
      console.error("Error deleting user", error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }
  }

  public async authenticateUser(
    email: string,
    password: string
  ): Promise<ReadUserDTO> {
    let user: FullUserDTO | null = null;
    try {
      user = await this.database.getUserByEmail(email);
    } catch (error) {
      console.error("Error fetching user by email", error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }

    const authValidator = new AuthenticationValidator(
      password,
      user,
      this.safePasswordHandler
    );
    await authValidator.validate();

    const { password: userPassword, ...userWithoutPassword } =
      user as FullUserDTO;

    return userWithoutPassword as ReadUserDTO;
  }
}
