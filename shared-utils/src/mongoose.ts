import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_DB_URI;
const dbName = process.env.MONGO_DB_NAME;

if (!uri || !dbName) {
  throw new Error(
    "MONGODB_URI or MONGO_DB_NAME environment variable is not defined"
  );
}

export const connectMongoose = async (mongoose: any) => {
  await mongoose.connect(uri, {
    dbName,
  });
};
