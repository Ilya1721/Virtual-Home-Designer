import mongoose from "mongoose";
import { AbstractDatabase } from "../../abstract/database";
import { UserAuth, UserAuthModel } from "./models/userAuth";

export class MongoDBDatabase implements AbstractDatabase {
  constructor(private uri: string) {}

  public async connect(): Promise<void> {
    await mongoose.connect(this.uri);
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  public async setRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    const user = await UserAuthModel.findOne({ userId });
    if (!user) {
      await this.createUserAuth(userId, refreshToken);
    } else {
      await this.updateUserAuth(user, refreshToken);
    }
  }

  public async getRefreshToken(userId: string): Promise<string> {
    const user = await UserAuthModel.findOne({ userId });
    return user ? user.refreshToken : "";
  }

  private async createUserAuth(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    await UserAuthModel.create({
      userId,
      refreshToken,
    });
  }

  private async updateUserAuth(
    user: mongoose.Document & UserAuth,
    refreshToken: string
  ): Promise<void> {
    user.refreshToken = refreshToken;
    await user.save();
  }
}
