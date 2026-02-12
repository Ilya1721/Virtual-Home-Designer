const {
  HouseItemGroupModel
} = require("../dist/database/concrete/MongoDB/models/HouseItemGroup");
const { connectMongoose } = require("shared-utils");
const mongoose = require("mongoose");

async function up(db, client) {
  await connectMongoose(mongoose);
  await HouseItemGroupModel.createCollection();
  await HouseItemGroupModel.syncIndexes();
}

async function down(db, client) {
  await connectMongoose(mongoose);
  await HouseItemGroupModel.collection.drop();
}

module.exports = { up, down };
