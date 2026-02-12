import mongoose from "mongoose";
import { connectMongoose } from "shared-utils";
import { AbstractDatabase } from "../../abstract/database";
import { HouseItemDTO, HouseItemGroup } from "shared-types";
import { HouseItemGroupModel } from "./models/HouseItemGroup";
import { HouseItemModel } from "./models/HouseItem";

export class MongoDBDatabase implements AbstractDatabase {
  public async connect(): Promise<void> {
    await connectMongoose(mongoose);
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  public async getAllGroups(): Promise<HouseItemGroup[]> {
    return await HouseItemGroupModel.find().exec();
  }

  public async getAllItemsOfGroup(groupId: string): Promise<HouseItemDTO[]> {
    return (await HouseItemModel.find({ groupId })
      .populate("group")
      .exec()) as unknown as HouseItemDTO[];
  }
}
