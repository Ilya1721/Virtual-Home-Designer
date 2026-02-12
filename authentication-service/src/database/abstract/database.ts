export interface AbstractDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  setRefreshToken(userId: string, refreshToken: string): Promise<void>;
  getRefreshToken(userId: string): Promise<string | null>;
}
