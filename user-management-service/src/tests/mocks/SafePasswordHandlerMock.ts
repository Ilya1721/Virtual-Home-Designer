import { SafePasswordHandler } from "../../business_model/abstract/password";

export class SafePasswordHandlerMock implements SafePasswordHandler {
  public async isEqual(
    safePassword: string,
    rawPassword: string
  ): Promise<boolean> {
    return safePassword === rawPassword;
  }

  public async getSafeString(rawPassword: string): Promise<string> {
    return rawPassword;
  }
}
