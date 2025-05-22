import { Router } from "express";
import { UserController } from "../../UserController";
import { getReqResPair } from "../../../factories/ExpressJSFactory";
import { AbstractRouter } from "../../../abstract/router";

export class UserRouter implements AbstractRouter {
  private router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.setRoutes();
  }

  private setGetAllUsersRoute() {
    this.router.get("/", async (req, res) => {
      await this.userController.getAllUsers(...getReqResPair(req, res));
    });
  }

  private setGetUserByIdRoute() {
    this.router.get("/:id", async (req, res) => {
      await this.userController.getUserById(...getReqResPair(req, res));
    });
  }

  private setCreateUserRoute() {
    this.router.post("/", async (req, res) => {
      await this.userController.createUser(...getReqResPair(req, res));
    });
  }

  private setEditUserRoute() {
    this.router.put("/:id", async (req, res) => {
      await this.userController.editUser(...getReqResPair(req, res));
    });
  }

  private setDeleteUserRoute() {
    this.router.delete("/:id", async (req, res) => {
      await this.userController.deleteUser(...getReqResPair(req, res));
    });
  }

  private setAuthenticateUserRoute() {
    this.router.post("/signin", async (req, res) => {
      await this.userController.authenticateUser(...getReqResPair(req, res));
    });
  }

  private setRoutes(): void {
    this.setGetAllUsersRoute();
    this.setGetUserByIdRoute();
    this.setCreateUserRoute();
    this.setEditUserRoute();
    this.setDeleteUserRoute();
    this.setAuthenticateUserRoute();
  }

  public connectRouter(connect: (router: Router) => void): void {
    connect(this.router);
  }
}
