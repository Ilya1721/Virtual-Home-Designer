import {
  CreateUserDTO,
  DeleteUserDTO,
  EditUserDTO,
  ReadUserDTO,
  FullUserDTO,
} from "shared-types";
import { AbstractDatabase } from "../../abstract/database";
import mongoose from "mongoose";
import { UserModel } from "./models/user";
import { connectMongoose } from "shared-utils";

export class MongoDBDatabase implements AbstractDatabase {
  public async connect(): Promise<void> {
    await connectMongoose(mongoose);
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  public async getAllUsers(): Promise<ReadUserDTO[]> {
    return await UserModel.find().exec();
  }

  public async getUserById(id: string): Promise<ReadUserDTO | null> {
    return await UserModel.findById(id).exec();
  }

  public async getUserByEmail(email: string): Promise<FullUserDTO | null> {
    return await UserModel.findOne({ email }).exec();
  }

  public async createUser(user: CreateUserDTO): Promise<ReadUserDTO> {
    return await UserModel.create(user);
  }

  public async editUser(user: EditUserDTO): Promise<ReadUserDTO | null> {
    return await UserModel.findByIdAndUpdate(user.id, user);
  }

  public async deleteUser(user: DeleteUserDTO): Promise<void> {
    await UserModel.findByIdAndDelete(user.id);
  }
}
