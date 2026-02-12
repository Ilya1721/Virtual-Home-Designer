import { Router } from "express";
import { AbstractRouter } from "shared-types";
import { AuthController } from "../../AuthController";
import { getReqResPair } from "shared-utils";

export class AuthRouter implements AbstractRouter {
  private router: Router;

  constructor(private authController: AuthController) {
    this.router = Router();
    this.setRoutes();
  }

  public connectRouter(connect: (router: Router) => void): void {
    connect(this.router);
  }

  private setSignUpRoute(): void {
    this.router.post("/signup", async (req, res) => {
      await this.authController.signUp(...getReqResPair(req, res));
    });
  }

  private setSignInRoute(): void {
    this.router.post("/signin", async (req, res) => {
      await this.authController.signIn(...getReqResPair(req, res));
    });
  }

  private setSignOutRoute(): void {
    this.router.post("/signout/:id", async (req, res) => {
      await this.authController.signOut(...getReqResPair(req, res));
    });
  }

  private setIsAuthenticatedRoute(): void {
    this.router.post("/status/:id", async (req, res) => {
      await this.authController.isAuthenticated(...getReqResPair(req, res));
    });
  }

  private setRefreshAccessRoute(): void {
    this.router.post("/refresh", async (req, res) => {
      await this.authController.refreshAccess(...getReqResPair(req, res));
    });
  }

  private setRoutes(): void {
    this.setSignUpRoute();
    this.setSignInRoute();
    this.setSignOutRoute();
    this.setIsAuthenticatedRoute();
    this.setRefreshAccessRoute();
  }
}
