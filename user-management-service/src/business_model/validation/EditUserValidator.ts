import { EditUserDTO } from "shared-types";
import { AbstractDatabase } from "../../database/abstract/AbstractDatabase";
import { CAN_NOT_CHANGE_USER_EMAIL, PROBLEM_WITH_DATABASE, USER_WITH_SUCH_ID_NOT_FOUND } from "../constants";

export class EditUserValidator {
  constructor(private user: EditUserDTO, private database: AbstractDatabase) {}

  public async validate(): Promise<void> {
    const { id, email } = this.user;

    let currentUser: EditUserDTO | null = null;
    try {
      currentUser = await this.database.getUserById(id);
    } catch (error) {
      throw new Error(PROBLEM_WITH_DATABASE);
    }

    if (!currentUser) {
      throw new Error(USER_WITH_SUCH_ID_NOT_FOUND);
    }

    if (email !== currentUser.email) {
      throw new Error(CAN_NOT_CHANGE_USER_EMAIL);
    }
  }
}