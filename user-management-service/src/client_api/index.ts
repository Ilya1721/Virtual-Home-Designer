import dotenv from "dotenv";
import { createExpressJSServer } from "./factories/ExpressJSFactory";
import { UserService } from "../business_model/UserService";
import { UserController } from "./concrete/UserController";
import { MongoDBDatabase } from "../database/concrete/MongoDB/database";
import { DB_URI_NOT_DEFINED } from "./concrete/constants";
import { UserRouter } from "./concrete/ExpressJS/routes/user";

const init = async () => {
  dotenv.config();
  const databaseURI = process.env.MONGODB_URI;
  if (!databaseURI) {
    throw new Error(DB_URI_NOT_DEFINED);
  }
  const database = new MongoDBDatabase(databaseURI);
  database.connect();

  const userService = new UserService(database);
  const userController = new UserController(userService);
  const userRouter = new UserRouter(userController);

  const server = createExpressJSServer();
  server.connectRouters(userRouter);
  const port = parseInt(process.env.PORT || "3000");
  server.start(port);

  ["SIGINT", "SIGTERM"].forEach((signal) =>
    process.on(signal, async () => {
      await database.disconnect();
      await server.dispose();
      process.exit(0);
    })
  );
};

init();
