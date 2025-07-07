import {
  AbstractRequest,
  AbstractResponse,
  AuthenticateUserDTO,
  CreateUserDTO,
  IsAuthenticatedReqDTO,
  ReadUserDTO,
  HttpStatus,
} from "shared-types";
import { AuthService } from "../../business_model/AuthService";
import { getHttpStatusByError } from "../../business_model/concrete/error";
import { SIGNED_OUT_SUCCESSFULY } from "../constants";
import { CookieManager } from "./cookie";

const accessTokenExpiresIn =
  Number(process.env.ACCESS_TOKEN_EXPIRES_IN_SECONDS) * 1000;
const refreshTokenExpiresIn =
  Number(process.env.RERFRESH_TOKEN_EXPIRES_IN_SECONDS) * 1000;

export class AuthController {
  private accessTokenCookieManager: CookieManager;
  private refreshTokenCookieManager: CookieManager;

  constructor(private authService: AuthService) {
    this.accessTokenCookieManager = new CookieManager("accessToken", {
      maxAge: accessTokenExpiresIn,
      path: "/api",
    });
    this.refreshTokenCookieManager = new CookieManager("refreshToken", {
      maxAge: refreshTokenExpiresIn,
      path: "/auth/refresh",
    });
  }

  public async signUp(
    req: AbstractRequest<CreateUserDTO>,
    res: AbstractResponse<ReadUserDTO, unknown>
  ): Promise<void> {
    try {
      const user = req.body;
      const signUpData = await this.authService.signUp(user);
      this.saveAuthTokensInCookies(
        signUpData.accessToken,
        signUpData.refreshToken,
        res
      );
      res.transformDataToJsonWithStatus(HttpStatus.OK, signUpData.user);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }

  public async signIn(
    req: AbstractRequest<AuthenticateUserDTO>,
    res: AbstractResponse<ReadUserDTO, unknown>
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const signInData = await this.authService.signIn(email, password);
      this.saveAuthTokensInCookies(
        signInData.accessToken,
        signInData.refreshToken,
        res
      );
      res.transformDataToJsonWithStatus(HttpStatus.OK, signInData.user);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }

  public async signOut(
    req: AbstractRequest<any>,
    res: AbstractResponse<any, unknown>
  ): Promise<void> {
    try {
      const userId = req.params.id;
      await this.authService.signOut(userId);
      this.expireAuthTokensInCookies(res);
      res.transformDataToJsonWithStatus(HttpStatus.OK, {
        message: SIGNED_OUT_SUCCESSFULY,
      });
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }

  public async isAuthenticated(
    req: AbstractRequest<IsAuthenticatedReqDTO>,
    res: AbstractResponse<boolean, unknown>
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const { allowedRoles, accessToken } = req.body;
      const isAuthenticated = await this.authService.isAuthenticated(
        userId,
        accessToken,
        allowedRoles
      );
      res.transformDataToJsonWithStatus(HttpStatus.OK, isAuthenticated);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }

  public async refreshAccess(
    req: AbstractRequest<void>,
    res: AbstractResponse<void, unknown>
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const refreshToken = req.cookies.refreshToken;
      const newAccessToken = await this.authService.refreshAccess(
        userId,
        refreshToken
      );
      this.accessTokenCookieManager.saveCookie(newAccessToken, res);
      res.transformDataToJsonWithStatus(HttpStatus.OK);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }

  private saveAuthTokensInCookies(
    accessToken: string,
    refreshToken: string,
    res: AbstractResponse<any, unknown>
  ): void {
    this.accessTokenCookieManager.saveCookie(accessToken, res);
    this.refreshTokenCookieManager.saveCookie(refreshToken, res);
  }

  private expireAuthTokensInCookies(
    res: AbstractResponse<any, unknown>
  ): void {
    this.accessTokenCookieManager.expireCookie(res);
    this.refreshTokenCookieManager.expireCookie(res);
  }
}
