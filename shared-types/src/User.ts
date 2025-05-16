export type User = {
  id: string;
  email: string;
  password: string;
  nickname: string;
  createdAt: Date;
}

export type ReadUserDTO = Omit<User, "password"> & {}
export type CreateUserDTO = Omit<User, "id" | "createdAt"> & {}
export type EditUserDTO = Omit<User, "createdAt"> & {}
export type DeleteUserDTO = Pick<User, "id"> & {}