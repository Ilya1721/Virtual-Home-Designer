import { Schema, model } from "mongoose";
import { HouseItem } from "shared-types";

type HouseItemDB = HouseItem & {
  group: Schema.Types.ObjectId;
};

const houseItemSchema = new Schema<HouseItemDB>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    previewImageUrl: { type: String, required: true },
    fileUrl: { type: String, required: true },
    group: {
      type: Schema.Types.ObjectId,
      ref: "HouseItemGroup",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

houseItemSchema.virtual("id").get(function () {
  return this._id.toString();
});

export const HouseItemModel = model<HouseItemDB>("HouseItem", houseItemSchema);
