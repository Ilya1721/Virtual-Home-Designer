import dotenv from "dotenv";
import { CatalogueService } from "../business_model/CatalogueService";
import { MongoDBDatabase } from "../database/concrete/MongoDB/database";
import { CatalogueController } from "./concrete/CatalogueController";
import { CatalogueRouter } from "./concrete/ExpressJS/routes/catalogue";
import { ExpressJSServer } from "./concrete/ExpressJS/server";

const init = async () => {
  dotenv.config();
  const database = new MongoDBDatabase();
  await database.connect();

  const catalogueService = new CatalogueService(database);
  const catalogueController = new CatalogueController(catalogueService);
  const catalogueRouter = new CatalogueRouter(catalogueController);

  const server = new ExpressJSServer();
  server.connectRouters(catalogueRouter);
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
