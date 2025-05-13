import { CreateUserDTO, EditUserDTO } from "shared-types";
import { HttpStatus } from "../../business_model/constants";
import { getHttpStatusByError } from "../../business_model/error";
import { UserService } from "../../business_model/UserService";
import { AbstractRequest } from "../abstract/request";
import { AbstractResponse } from "../abstract/response";
import { USER_DELETED_SUCCESSFULLY } from "./constants";

export class UserController {
  constructor(private userService: UserService) {}

  public async getAllUsers(
    req: AbstractRequest,
    res: AbstractResponse
  ): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.transformToJsonWithStatus(HttpStatus.OK, users);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformToJsonWithStatus(httpStatus, error);
    }
  }

  public async getUserById(
    req: AbstractRequest,
    res: AbstractResponse
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);
      res.transformToJsonWithStatus(HttpStatus.OK, user);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformToJsonWithStatus(httpStatus, error);
    }
  }

  public async createUser(
    req: AbstractRequest,
    res: AbstractResponse
  ): Promise<void> {
    try {
      const userData = req.body;
      const newUser = await this.userService.createUser(
        userData as CreateUserDTO
      );
      res.transformToJsonWithStatus(HttpStatus.OK, newUser);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformToJsonWithStatus(httpStatus, error);
    }
  }

  public async editUser(
    req: AbstractRequest,
    res: AbstractResponse
  ): Promise<void> {
    try {
      const userData = req.body;
      const updatedUser = await this.userService.editUser(
        userData as EditUserDTO
      );
      res.transformToJsonWithStatus(HttpStatus.OK, updatedUser);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformToJsonWithStatus(httpStatus, error);
    }
  }

  public async deleteUser(
    req: AbstractRequest,
    res: AbstractResponse
  ): Promise<void> {
    try {
      const userId = req.params.id;
      await this.userService.deleteUser({ id: userId });
      res.transformToJsonWithStatus(HttpStatus.OK, {
        message: USER_DELETED_SUCCESSFULLY,
      });
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformToJsonWithStatus(httpStatus, error);
    }
  }
}
