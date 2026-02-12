import { HouseItemGroup, HouseItemDTO } from "shared-types";
import { AbstractDatabase } from "../../database/abstract/database";

export class DatabaseMock implements AbstractDatabase {
  public async connect(): Promise<void> {}

  public async disconnect(): Promise<void> {}

  public async getAllGroups(): Promise<HouseItemGroup[]> {
    return [];
  }

  public async getAllItemsOfGroup(groupId: string): Promise<HouseItemDTO[]> {
    return [];
  }
}
