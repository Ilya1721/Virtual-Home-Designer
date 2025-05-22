import { EditUserDTO } from "shared-types";
import { AbstractDatabase } from "../../../database/abstract/database";
import { BusinessError } from "../error";

export class EditUserValidator {
  constructor(private user: EditUserDTO, private database: AbstractDatabase) {}

  public async validate(): Promise<void> {
    const { id, email } = this.user;

    let currentUser: EditUserDTO | null = null;
    try {
      currentUser = await this.database.getUserById(id);
    } catch (error) {
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }

    if (!currentUser) {
      throw new Error(BusinessError.USER_WITH_SUCH_ID_NOT_FOUND);
    }

    if (email !== currentUser.email) {
      throw new Error(BusinessError.CAN_NOT_CHANGE_USER_EMAIL);
    }
  }
}