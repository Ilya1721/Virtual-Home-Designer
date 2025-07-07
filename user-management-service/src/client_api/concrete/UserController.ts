import {
  AbstractRequest,
  AbstractResponse,
  AuthenticateUserDTO,
  CreateUserDTO,
  EditUserDTO,
  ReadUserDTO,
  HttpStatus,
} from "shared-types";
import { getHttpStatusByError } from "../../business_model/concrete/error";
import { UserService } from "../../business_model/UserService";
import { USER_DELETED_SUCCESSFULLY } from "./constants";

export class UserController {
  constructor(private userService: UserService) {}

  public async getAllUsers(
    req: AbstractRequest<any>,
    res: AbstractResponse<ReadUserDTO[], unknown>
  ): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.transformDataToJsonWithStatus(HttpStatus.OK, users);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }

  public async getUserById(
    req: AbstractRequest<any>,
    res: AbstractResponse<ReadUserDTO | null, unknown>
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);
      res.transformDataToJsonWithStatus(HttpStatus.OK, user);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }

  public async createUser(
    req: AbstractRequest<CreateUserDTO>,
    res: AbstractResponse<ReadUserDTO, unknown>
  ): Promise<void> {
    try {
      const userData = req.body;
      const newUser = await this.userService.createUser(userData);
      res.transformDataToJsonWithStatus(HttpStatus.OK, newUser);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }

  public async editUser(
    req: AbstractRequest<EditUserDTO>,
    res: AbstractResponse<ReadUserDTO | null, unknown>
  ): Promise<void> {
    try {
      const userData = req.body;
      const updatedUser = await this.userService.editUser(userData);
      res.transformDataToJsonWithStatus(HttpStatus.OK, updatedUser);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }

  public async deleteUser(
    req: AbstractRequest<any>,
    res: AbstractResponse<any, unknown>
  ): Promise<void> {
    try {
      const userId = req.params.id;
      await this.userService.deleteUser({ id: userId });
      res.transformDataToJsonWithStatus(HttpStatus.OK, {
        message: USER_DELETED_SUCCESSFULLY,
      });
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }

  public async authenticateUser(
    req: AbstractRequest<AuthenticateUserDTO>,
    res: AbstractResponse<ReadUserDTO, unknown>
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.userService.authenticateUser(
        email as string,
        password as string
      );
      res.transformDataToJsonWithStatus(HttpStatus.OK, user);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }
}
