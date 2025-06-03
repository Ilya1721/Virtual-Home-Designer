import dotenv from "dotenv";
import { DB_URI_NOT_DEFINED } from "shared-utils";
import { MongoDBDatabase } from "../database/concrete/MongoDB/database";
import { ExpressJSServer } from "./concrete/ExpressJS/server";
import { AuthRouter } from "./concrete/ExpressJS/routes/auth";
import { AuthController } from "./concrete/AuthController";
import { AuthService } from "../business_model/AuthService";
import { JWTAuth } from "../business_model/concrete/JWTAuth/auth";

const init = async () => {
  dotenv.config();
  const databaseURI = process.env.MONGODB_URI;
  if (!databaseURI) {
    throw new Error(DB_URI_NOT_DEFINED);
  }
  const database = new MongoDBDatabase(databaseURI);
  await database.connect();

  const auth = new JWTAuth();
  const authService = new AuthService(auth, database);
  const authController = new AuthController(authService);
  const authRouter = new AuthRouter(authController);

  const server = new ExpressJSServer();
  server.connectRouters(authRouter);
  const port = parseInt(process.env.PORT || "3000");
  server.start(port);

  ["SIGINT", "SIGTERM"].forEach((signal) =>
    process.on(signal, async () => {
      await database.disconnect();
      await server.dispose();
      process.exit(0);
    })
  );
}

init();