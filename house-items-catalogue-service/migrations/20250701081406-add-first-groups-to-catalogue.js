const {
  HouseItemGroupModel
} = require("../dist/database/concrete/MongoDB/models/HouseItemGroup");
const { connectMongoose } = require("shared-utils");
const mongoose = require("mongoose");

async function up(db, client) {
  await connectMongoose(mongoose);
  await HouseItemGroupModel.create({
    name: "Furniture",
    description: "Tables, chairs, sofas, etc.",
    createdAt: new Date()
  });
}

async function down(db, client) {
  await connectMongoose(mongoose);
  await HouseItemGroupModel.deleteOne({ name: "Furniture" });
}

module.exports = { up, down };
