export type HouseItem = {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
  fileUrl: string;
  createdAt: Date;
};

export type HouseItemDTO = HouseItem & {
  group: HouseItemGroup;
};

export type HouseItemGroup = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
};
