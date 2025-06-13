const { UserAuthModel } = require("../dist/database/concrete/MongoDB/models/userAuth");
const { connectMongoose } = require("shared-utils");
const mongoose = require("mongoose");

async function up(db, client) {
  await connectMongoose(mongoose);
  await UserAuthModel.createCollection();
  await UserAuthModel.syncIndexes();
}

async function down(db, client) {
  await connectMongoose(mongoose);
  await UserAuthModel.collection.drop();
}

module.exports = { up, down };
