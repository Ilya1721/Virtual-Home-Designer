import { HouseItemGroup, HouseItemDTO } from "shared-types";
import { AbstractDatabase } from "../database/abstract/database";
import { BusinessError } from "./concrete/error";

export class CatalogueService {
  constructor(private database: AbstractDatabase) {}

  public async getAllGroups(): Promise<HouseItemGroup[]> {
    try {
      return await this.database.getAllGroups();
    } catch (error) {
      console.error("Error fetching all groups", error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }
  }

  public async getAllItemsOfGroup(groupId: string): Promise<HouseItemDTO[]> {
    try {
      return await this.database.getAllItemsOfGroup(groupId);
    } catch (error) {
      console.error(`Error fetching items for group ID: ${groupId}`, error);
      throw new Error(BusinessError.PROBLEM_WITH_DATABASE);
    }
  }
}
