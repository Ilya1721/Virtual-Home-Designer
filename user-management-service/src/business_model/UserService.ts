import { CreateUserDTO, DeleteUserDTO, EditUserDTO } from "shared-types";
import { AbstractDatabase } from "../database/abstract/AbstractDatabase";
import { CreateUserValidator } from "./validation/CreateUserValidator";
import { EditUserValidator } from "./validation/EditUserValidator";
import { DeleteUserValidator } from "./validation/DeleteUserValidator";
import { BusinessError } from "./error";

export class UserService {
  constructor(private database: AbstractDatabase) {}

  public async getAllUsers() {
    try {
      return await this.database.getAllUsers();
    } catch (error) {
      console.error("Error fetching all users", error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }
  }

  public async getUserById(id: string) {
    try {
      return await this.database.getUserById(id);
    } catch (error) {
      console.error(`Error fetching user by ID: ${id}`, error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }
  }

  public async createUser(user: CreateUserDTO) {
    const validator = new CreateUserValidator(user, this.database);
    await validator.validate();

    try {
      return await this.database.createUser(user);
    } catch (error) {
      console.error("Error creating user", error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }
  }

  public async editUser(user: EditUserDTO) {
    const validator = new EditUserValidator(user, this.database);
    await validator.validate();

    try {
      return await this.database.editUser(user);
    } catch (error) {
      console.error("Error editing user", error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }
  }

  public async deleteUser(user: DeleteUserDTO) {
    const validator = new DeleteUserValidator(user, this.database);
    await validator.validate();

    try {
      await this.database.deleteUser(user);
    } catch (error) {
      console.error("Error deleting user", error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }
  }
}