import {
  AbstractRequest,
  AbstractResponse,
  AuthenticateUserDTO,
  CreateUserDTO,
  IsAuthenticatedReqDTO,
  RefreshAccessReqDTO,
  RefreshAccessResDTO,
  SignUpDTO,
} from "shared-types";
import { HttpStatus } from "shared-utils";
import { AuthService } from "../../business_model/AuthService";
import { getHttpStatusByError } from "../../business_model/concrete/error";
import { SIGNED_OUT_SUCCESSFULY } from "../constants";

export class AuthController {
  constructor(private authService: AuthService) {}

  public async signUp(
    req: AbstractRequest<CreateUserDTO>,
    res: AbstractResponse<SignUpDTO, unknown>
  ): Promise<void> {
    try {
      const user = req.body;
      const signUpData = await this.authService.signUp(user);
      res.transformDataToJsonWithStatus(HttpStatus.OK, signUpData);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }

  public async signIn(
    req: AbstractRequest<AuthenticateUserDTO>,
    res: AbstractResponse<SignUpDTO, unknown>
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const signInData = await this.authService.signIn(email, password);
      res.transformDataToJsonWithStatus(HttpStatus.OK, signInData);
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
      const { accessToken, allowedRoles } = req.body;
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
    req: AbstractRequest<RefreshAccessReqDTO>,
    res: AbstractResponse<RefreshAccessResDTO, unknown>
  ): Promise<void> {
    try {
      const { userId, refreshToken } = req.body;
      const newAccessToken = await this.authService.refreshAccess(
        userId,
        refreshToken
      );
      res.transformDataToJsonWithStatus(HttpStatus.OK, {
        accessToken: newAccessToken,
      });
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }
}
