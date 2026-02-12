import { FullUserDTO } from "shared-types";
import { SafePasswordHandler } from "../../abstract/password";
import { BusinessError } from "../error";

export class AuthenticationValidator {
  constructor(
    private password: string,
    private user: FullUserDTO | null,
    private safePasswordHandler: SafePasswordHandler
  ) {}

  public async validate(): Promise<void> {
    if (!this.user) {
      throw new Error(BusinessError.USER_WITH_SUCH_EMAIL_OR_PASSWORD_NOT_FOUND);
    }

    const isCorrectPassword = await this.safePasswordHandler.isEqual(
      this.user.password,
      this.password
    );

    if (!isCorrectPassword) {
      throw new Error(BusinessError.USER_WITH_SUCH_EMAIL_OR_PASSWORD_NOT_FOUND);
    }
  }
}
