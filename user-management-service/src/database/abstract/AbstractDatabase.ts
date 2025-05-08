import {
  ReadUserDTO,
  CreateUserDTO,
  EditUserDTO,
  DeleteUserDTO,
} from "shared-types";

export interface AbstractDatabase {
  getUserById(id: string): Promise<ReadUserDTO | null>;
  getAllUsers(): Promise<ReadUserDTO[]>;
  createUser(user: CreateUserDTO): Promise<ReadUserDTO>;
  editUser(user: EditUserDTO): Promise<ReadUserDTO | null>;
  deleteUser(user: DeleteUserDTO): Promise<boolean>;
}
