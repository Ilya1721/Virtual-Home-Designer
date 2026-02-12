import { AbstractRouter, AbstractServer } from "shared-types";
import { AbstractExpressJSServer } from "shared-utils";

export class ExpressJSServer
  extends AbstractExpressJSServer
  implements AbstractServer
{
  constructor() {
    super();
  }

  public connectRouters(userRouter: AbstractRouter): void {
    userRouter.connectRouter((router) => {
      this.app.use("/api/catalogue", router);
    });
  }
}
