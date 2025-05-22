import { AuthToken } from "shared-types";
import { AbstractDatabase } from "../../database/abstract/database";

export class DatabaseMock implements AbstractDatabase {
  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}
  async setRefreshToken(userId: string, refreshToken: AuthToken): Promise<void> {}
  async getRefreshToken(userId: string): Promise<AuthToken | null> {
    return null;
  }
}