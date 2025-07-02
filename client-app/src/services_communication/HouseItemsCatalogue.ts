import axios from "axios";
import { HouseItemDTO, HouseItemGroup } from "shared-types";

const CATALOGUE_SERVICE_URL = process.env.HOUSE_ITEMS_CATALOGUE_SERVICE_URL;

export const getAllGroups = async (): Promise<HouseItemGroup[]> => {
  const res = await axios.get<HouseItemGroup[]>(
    `${CATALOGUE_SERVICE_URL}/groups`
  );
  return res.data;
};

export const getAllItemsOfGroup = async (
  groupId: string
): Promise<HouseItemDTO[]> => {
  const res = await axios.get<HouseItemDTO[]>(
    `${CATALOGUE_SERVICE_URL}/groups/${groupId}/items`
  );
  return res.data;
};
