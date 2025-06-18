import dotenv from "dotenv";
import { UserService } from "../business_model/UserService";
import { UserController } from "./concrete/UserController";
import { MongoDBDatabase } from "../database/concrete/MongoDB/database";
import { UserRouter } from "./concrete/ExpressJS/routes/user";
import { Argon2PasswordHandler } from "./concrete/Argon2/password";
import { ExpressJSServer } from "./concrete/ExpressJS/server";

const init = async () => {
  dotenv.config();
  const database = new MongoDBDatabase();
  await database.connect();

  const safePasswordHandler = new Argon2PasswordHandler();
  const userService = new UserService(database, safePasswordHandler);
  const userController = new UserController(userService);
  const userRouter = new UserRouter(userController);

  const server = new ExpressJSServer();
  server.connectRouters(userRouter);
  const port = parseInt(process.env.PORT!);
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
