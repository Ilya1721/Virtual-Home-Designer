import { ReadUserDTO, CreateUserDTO, EditUserDTO, DeleteUserDTO } from 'shared-types';
import { AbstractDatabase } from '../../database/abstract/AbstractDatabase';

export class DatabaseMock implements AbstractDatabase {
  async getUserById(id: string): Promise<ReadUserDTO | null> {
    return null;
  }

  async getAllUsers(): Promise<ReadUserDTO[]> {
    return [];
  }

  async createUser(user: CreateUserDTO): Promise<ReadUserDTO> {
    return {} as ReadUserDTO;
  }

  async editUser(user: EditUserDTO): Promise<ReadUserDTO | null> {
    return null;
  }

  async deleteUser(user: DeleteUserDTO): Promise<boolean> {
    return true;
  }
}