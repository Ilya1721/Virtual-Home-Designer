const { UserModel } = require("../dist/database/concrete/MongoDB/models/user");
const { connectMongoose } = require("shared-utils");
const mongoose = require("mongoose");

async function up(db, client) {
  await connectMongoose(mongoose);
  await UserModel.createCollection();
  await UserModel.syncIndexes();
}

async function down(db, client) {
  await connectMongoose(mongoose);
  await UserModel.collection.drop();
}

module.exports = { up, down };
