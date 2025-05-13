import { AbstractResponse } from "../../abstract/response";
import { Response } from 'express';

export class ExpressJSResponse implements AbstractResponse {
  constructor(private res: Response) {}

  public transformToJsonWithStatus(status: number, data: any): void {
    this.res.status(status).json(data);
  }
}