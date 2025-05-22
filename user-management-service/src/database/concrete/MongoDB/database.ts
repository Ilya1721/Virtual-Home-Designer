import { CreateUserDTO, DeleteUserDTO, EditUserDTO, ReadUserDTO, FullUserDTO } from "shared-types";
import { AbstractDatabase } from "../../abstract/database";
import mongoose from "mongoose";
import { UserModel } from "./models/user";

export class MongoDBDatabase implements AbstractDatabase {
  constructor(private uri: string) {}

  public async connect(): Promise<void> {
    await mongoose.connect(this.uri);
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
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser;
  }

  public async editUser(user: EditUserDTO): Promise<ReadUserDTO | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      user,
    );
    return updatedUser;
  }

  public async deleteUser(user: DeleteUserDTO): Promise<void> {
    await UserModel.findByIdAndDelete(user.id);
  }
}
