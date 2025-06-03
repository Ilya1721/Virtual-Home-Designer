import { AbstractRequest, AbstractResponse } from "shared-types";
import { Response } from "express";

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
