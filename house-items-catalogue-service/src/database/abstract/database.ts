import { HouseItemGroup, HouseItemDTO } from "shared-types";

export interface AbstractDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getAllGroups(): Promise<HouseItemGroup[]>;
  getAllItemsOfGroup(groupId: string): Promise<HouseItemDTO[]>;
}
