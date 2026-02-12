import { AbstractRouter, AbstractServer } from "shared-types";
import express from "express";
import { Express } from "express-serve-static-core";
import cookieParser from "cookie-parser";

export abstract class AbstractExpressJSServer implements AbstractServer {
  protected app!: Express;

  constructor() {
    this.initServer();
  }

  private initServer() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  public async start(port: number): Promise<void> {
    this.app.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  }

  public async dispose(): Promise<void> {}

  public abstract connectRouters(userRouter: AbstractRouter): void;
}
