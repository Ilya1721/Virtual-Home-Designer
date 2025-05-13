import { AbstractRequest } from "../abstract/request";
import { AbstractResponse } from "../abstract/response";
import { ExpressJSRequest } from "../concrete/ExpressJS/request";
import { ExpressJSResponse } from "../concrete/ExpressJS/response";
import { ExpressJSServer } from "../concrete/ExpressJS/server";
import { Response } from "express";

export const createExpressJSRequest = (
  params: Record<string, string>,
  body: Record<string, unknown>
) => {
  return new ExpressJSRequest(params, body);
};

export const createExpressJSResponse = (res: Response) => {
  return new ExpressJSResponse(res);
};

export const createExpressJSServer = () => {
  return new ExpressJSServer();
};

export const getReqResPair = (
  req: any,
  res: any
): [AbstractRequest, AbstractResponse] => {
  return [
    createExpressJSRequest(req.params, req.body),
    createExpressJSResponse(res),
  ];
};
