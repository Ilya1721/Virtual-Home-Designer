const {
  HouseItemModel
} = require("../dist/database/concrete/MongoDB/models/HouseItem");
const {
  HouseItemGroupModel
} = require("../dist/database/concrete/MongoDB/models/HouseItemGroup");
const { connectMongoose } = require("shared-utils");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.catalogue.env")
});

async function up(db, client) {
  await connectMongoose(mongoose);
  const group = await HouseItemGroupModel.findOne().sort({ _id: 1 });
  if (!group) throw new Error("No HouseItemGroup found");

  await HouseItemModel.create([
    {
      name: "Lamp",
      description: "Simple lamp",
      previewImageUrl: process.env.LAMP_PREVIEW_IMAGE_URL,
      fileUrl: process.env.LAMP_FILE_URL,
      groupId: group.id,
      createdAt: new Date()
    },
    {
      name: "Robot",
      description: "Simple Robot",
      previewImageUrl: process.env.ROBOT_PREVIEW_IMAGE_URL,
      fileUrl: process.env.ROBOT_FILE_URL,
      groupId: group.id,
      createdAt: new Date()
    }
  ]);
}

async function down(db, client) {
  await connectMongoose(mongoose);
  await HouseItemModel.deleteMany({ name: { $in: ["Lamp", "Robot"] } });
}

module.exports = { up, down };
