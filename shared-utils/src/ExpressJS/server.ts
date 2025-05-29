import { AbstractRequest, AbstractResponse } from "shared-types";
import { Response } from "express";
import express from "express";
import { Express } from "express-serve-static-core";
import { AbstractRouter, AbstractServer } from "shared-types";

export class ExpressJSRequest<Body> implements AbstractRequest<Body> {
  constructor(public params: Record<string, string>, public body: Body) {}
}

export class ExpressJSResponse<Data, Error>
  implements AbstractResponse<Data, Error>
{
  constructor(private res: Response) {}

  public transformDataToJsonWithStatus(status: number, data: Data): void {
    this.res.status(status).json(data);
  }

  public transformErrorToJsonWithStatus(status: number, error: Error): void {
    this.res.status(status).json(error);
  }
}

export const getReqResPair = (
  req: any,
  res: any
): [AbstractRequest<any>, AbstractResponse<any, any>] => {
  return [
    new ExpressJSRequest(req.params, req.body),
    new ExpressJSResponse(res),
  ];
};

export abstract class AbstractExpressJSServer implements AbstractServer {
  protected app!: Express;

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

  public abstract connectRouters(userRouter: AbstractRouter): void
}
