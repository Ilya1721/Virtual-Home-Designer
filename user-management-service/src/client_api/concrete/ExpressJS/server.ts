import { AbstractServer } from "../../abstract/server";
import express from "express";
import { Express } from "express-serve-static-core";
import { AbstractRouter } from "../../abstract/router";

export class ExpressJSServer implements AbstractServer {
  private app!: Express;

  constructor() {
    this.initServer();
  }

  private initServer() {
    this.app = express();
    this.app.use(express.json());
  }

  public async start(port: number): Promise<void> {
    this.app.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  }

  public async dispose(): Promise<void> {}

  public connectRouters(userRouter: AbstractRouter): void {
    userRouter.connectRouter((router) => {
      this.app.use("/users", router);
    });
  }
}
