import { ReadUserDTO } from "shared-types";

export interface UserStorage {
  saveUser(user: ReadUserDTO): Promise<void>;
  getUser(): Promise<ReadUserDTO | null>;
  clearUser(): Promise<void>;
}