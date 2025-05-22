export type User = {
  id: string;
  email: string;
  password: string;
  nickname: string;
  createdAt: Date;
}

export type FullUserDTO = User & {}
export type ReadUserDTO = Omit<User, "password"> & {}
export type CreateUserDTO = Omit<User, "id" | "createdAt"> & {}
export type EditUserDTO = Omit<User, "createdAt" | "password"> & Partial<Pick<User, "password">> & {}
export type DeleteUserDTO = Pick<User, "id"> & {}