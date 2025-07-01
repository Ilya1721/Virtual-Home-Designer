const { HouseItemModel } = require("../dist/database/concrete/MongoDB/models/HouseItem");
const { connectMongoose } = require("shared-utils");
const mongoose = require("mongoose");

async function up(db, client) {
  await connectMongoose(mongoose);
  await HouseItemModel.createCollection();
  await HouseItemModel.syncIndexes();
}

async function down(db, client) {
  await connectMongoose(mongoose);
  await HouseItemModel.collection.drop();
}

module.exports = { up, down };
