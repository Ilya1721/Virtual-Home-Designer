import { Router } from "express";
import { AbstractRouter } from "shared-types";
import { getReqResPair } from "shared-utils";
import { CatalogueController } from "../../CatalogueController";

export class CatalogueRouter implements AbstractRouter {
  private router: Router;

  constructor(private catalogueController: CatalogueController) {
    this.router = Router();
    this.setRoutes();
  }

  private setGetAllGroupsRoute() {
    this.router.get("/groups", async (req, res) => {
      await this.catalogueController.getAllGroups(...getReqResPair(req, res));
    });
  }

  private setGetAllItemsOfGroupRoute() {
    this.router.get("/groups/:id/items", async (req, res) => {
      await this.catalogueController.getAllItemsOfGroup(
        ...getReqResPair(req, res)
      );
    });
  }

  private setRoutes(): void {
    this.setGetAllGroupsRoute();
    this.setGetAllItemsOfGroupRoute();
  }

  public connectRouter(connect: (router: Router) => void): void {
    connect(this.router);
  }
}
