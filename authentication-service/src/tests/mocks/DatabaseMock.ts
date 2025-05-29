import { AbstractDatabase } from "../../database/abstract/database";

export class DatabaseMock implements AbstractDatabase {
  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}
  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {}
  async getRefreshToken(userId: string): Promise<string | null> {
    return null;
  }
}