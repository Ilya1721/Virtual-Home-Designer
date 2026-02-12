import { DeleteUserDTO, ReadUserDTO } from "shared-types";
import { AbstractDatabase } from "../../../database/abstract/database";
import { BusinessError } from "../error";

export class DeleteUserValidator {
  constructor(
    private user: DeleteUserDTO,
    private database: AbstractDatabase
  ) {}

  public async validate(): Promise<void> {
    const { id } = this.user;

    let currentUser: ReadUserDTO | null = null;
    try {
      currentUser = await this.database.getUserById(id);
    } catch (error) {
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }

    if (!currentUser) {
      throw new Error(BusinessError.USER_WITH_SUCH_ID_NOT_FOUND);
    }
  }
}
