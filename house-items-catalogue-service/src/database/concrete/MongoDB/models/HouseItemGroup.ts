import { model, Schema } from "mongoose";
import { HouseItemGroup } from "shared-types";

const houseItemGroupSchema = new Schema<HouseItemGroup>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

houseItemGroupSchema.virtual("id").get(function () {
  return this._id.toString();
});

export const HouseItemGroupModel = model<HouseItemGroup>(
  "HouseItemGroup",
  houseItemGroupSchema
);
