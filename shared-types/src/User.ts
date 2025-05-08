export type ReadUserDTO = {
  id: string;
  email: string;
  nickname: string;
}

export type CreateUserDTO = ReadUserDTO & {
  password: string;
}

export type EditUserDTO = Pick<CreateUserDTO, "id"> & Partial<Omit<CreateUserDTO, "id">> & {}

export type DeleteUserDTO = Pick<ReadUserDTO, "id"> & {}