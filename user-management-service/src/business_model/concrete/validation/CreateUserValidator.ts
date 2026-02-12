import { CreateUserDTO, ReadUserDTO } from "shared-types";
import { AbstractDatabase } from "../../../database/abstract/database";
import { BusinessError } from "../error";

export class CreateUserValidator {
  constructor(
    private user: CreateUserDTO,
    private database: AbstractDatabase
  ) {}

  public async validate(): Promise<void> {
    const { email, password } = this.user;

    if (!email || !this.isValidEmail(email)) {
      throw new Error(BusinessError.USER_EMAIL_NOT_VALID);
    }

    if (!password) {
      throw new Error(BusinessError.USER_PASSWORD_NOT_VALID);
    }

    let existingUsers: ReadUserDTO[] = [];
    try {
      existingUsers = await this.database.getAllUsers();
    } catch (error) {
      console.error("Error fetching existing users", error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }

    const userWithSameEmail = existingUsers.find(
      (existingUser: ReadUserDTO) => existingUser.email === this.user.email
    );
    if (userWithSameEmail) {
      throw new Error(BusinessError.USER_WITH_SUCH_EMAIL_ALREADY_EXISTS);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
