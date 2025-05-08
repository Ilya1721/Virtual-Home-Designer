import { CreateUserDTO, ReadUserDTO } from "shared-types";
import { PROBLEM_WITH_DATABASE, USER_EMAIL_NOT_VALID, USER_ID_NOT_UNIQUE, USER_PASSWORD_NOT_VALID, USER_WITH_SUCH_EMAIL_ALREADY_EXISTS } from "../constants";
import { AbstractDatabase } from "../../database/abstract/AbstractDatabase";

export class CreateUserValidator {
  constructor(private user: CreateUserDTO, private database: AbstractDatabase) {}

  public async validate(): Promise<void> {
    const { email, password } = this.user;

    if (!email || !this.isValidEmail(email)) {
      throw new Error(USER_EMAIL_NOT_VALID);
    }

    if (!password) {
      throw new Error(USER_PASSWORD_NOT_VALID);
    }

    let existingUsers: ReadUserDTO[] = [];
    try {
      existingUsers = await this.database.getAllUsers();
    } catch (error) {
      console.error("Error fetching existing users", error);
      throw new Error(PROBLEM_WITH_DATABASE);
    }

    const userWithSameEmail = existingUsers.find(
      (existingUser: ReadUserDTO) => existingUser.email === this.user.email
    );
    if (userWithSameEmail) {
      throw new Error(USER_WITH_SUCH_EMAIL_ALREADY_EXISTS);
    }

    const userWithSameId = existingUsers.find(
      (existingUser: ReadUserDTO) => existingUser.id === this.user.id
    );
    if (userWithSameId) {
      throw new Error(USER_ID_NOT_UNIQUE);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}