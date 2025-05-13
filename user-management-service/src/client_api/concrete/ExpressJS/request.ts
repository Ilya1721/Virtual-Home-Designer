import { AbstractRequest } from "../../abstract/request";

export class ExpressJSRequest implements AbstractRequest {
  constructor(
    public params: Record<string, string>,
    public body: Record<string, unknown>
  ) {}
}
