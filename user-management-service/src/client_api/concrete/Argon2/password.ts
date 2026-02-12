import { SafePasswordHandler } from "../../../business_model/abstract/password";
import argon2 from "argon2";

export class Argon2PasswordHandler implements SafePasswordHandler {
  public async isEqual(
    safePassword: string,
    rawPassword: string
  ): Promise<boolean> {
    return await argon2.verify(safePassword, rawPassword);
  }

  public async getSafeString(rawPassword: string): Promise<string> {
    return await argon2.hash(rawPassword);
  }
}
