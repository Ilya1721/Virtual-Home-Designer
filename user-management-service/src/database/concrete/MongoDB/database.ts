import { AbstractDatabase } from "../../abstract/AbstractDatabase";
import mongoose from "mongoose";

export class MongoDBDatabase implements AbstractDatabase {
  constructor(private uri: string) {}

  public async connect(): Promise<void> {
    await mongoose.connect(this.uri);
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  public async getAllUsers(): Promise<any[]> {
    return [];
  }

  public async getUserById(id: string): Promise<any | null> {
    return null;
  }

  public async createUser(user: any): Promise<any> {
    return null;
  }

  public async editUser(user: any): Promise<any | null> {
    return null;
  }
  public async deleteUser(user: any): Promise<void> {}
}
