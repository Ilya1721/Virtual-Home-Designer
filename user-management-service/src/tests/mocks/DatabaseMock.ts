import {
  ReadUserDTO,
  CreateUserDTO,
  EditUserDTO,
  DeleteUserDTO,
  FullUserDTO
} from "shared-types";
import { AbstractDatabase } from "../../database/abstract/database";

export class DatabaseMock implements AbstractDatabase {
  public async connect(): Promise<void> {}

  public async disconnect(): Promise<void> {}

  public async getUserById(id: string): Promise<ReadUserDTO | null> {
    return null;
  }

  public async getAllUsers(): Promise<ReadUserDTO[]> {
    return [];
  }

  public async createUser(user: CreateUserDTO): Promise<ReadUserDTO> {
    return {} as ReadUserDTO;
  }

  public async editUser(user: EditUserDTO): Promise<ReadUserDTO | null> {
    return null;
  }

  public async deleteUser(user: DeleteUserDTO): Promise<void> {}

  public async getUserByEmail(email: string): Promise<FullUserDTO | null> {
    return null;
  }
}
