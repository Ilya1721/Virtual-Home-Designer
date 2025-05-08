import { CreateUserDTO, EditUserDTO, ReadUserDTO } from "shared-types";
import { AbstractDatabase } from "../database/abstract/AbstractDatabase";
import { PROBLEM_WITH_DATABASE, USER_WITH_SUCH_EMAIL_ALREADY_EXISTS } from "./constants";
import { CreateUserValidator } from "./validation/CreateUserValidator";
import { EditUserValidator } from "./validation/EditUserValidator";

export class UserService {
  constructor(private database: AbstractDatabase) {}

  public async getAllUsers() {
    try {
      return await this.database.getAllUsers();
    } catch (error) {
      console.error("Error fetching all users", error);
      throw new Error(PROBLEM_WITH_DATABASE);
    }
  }

  public async getUserById(id: string) {
    try {
      return await this.database.getUserById(id);
    } catch (error) {
      console.error(`Error fetching user by ID: ${id}`, error);
      throw new Error(PROBLEM_WITH_DATABASE);
    }
  }

  public async createUser(user: CreateUserDTO) {
    const validator = new CreateUserValidator(user, this.database);
    await validator.validate();

    try {
      return await this.database.createUser(user);
    } catch (error) {
      console.error("Error creating user", error);
      throw new Error(PROBLEM_WITH_DATABASE);
    }
  }

  public async editUser(user: EditUserDTO) {
    const validator = new EditUserValidator(user, this.database);
    await validator.validate();

    try {
      return await this.database.editUser(user);
    } catch (error) {
      console.error("Error editing user", error);
      throw new Error(PROBLEM_WITH_DATABASE);
    }
  }
}