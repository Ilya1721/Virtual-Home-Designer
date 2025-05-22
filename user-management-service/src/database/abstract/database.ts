import {
  ReadUserDTO,
  CreateUserDTO,
  EditUserDTO,
  DeleteUserDTO,
  FullUserDTO,
} from "shared-types";

export interface AbstractDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getUserById(id: string): Promise<ReadUserDTO | null>;
  getUserByEmail(email: string): Promise<FullUserDTO | null>;
  getAllUsers(): Promise<ReadUserDTO[]>;
  createUser(user: CreateUserDTO): Promise<ReadUserDTO>;
  editUser(user: EditUserDTO): Promise<ReadUserDTO | null>;
  deleteUser(user: DeleteUserDTO): Promise<void>;
}
