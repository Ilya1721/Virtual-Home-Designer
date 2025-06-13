import { ReadUserDTO } from "shared-types";

export const toReadUserDTO = <UserType extends ReadUserDTO>(
  user: UserType
): ReadUserDTO => {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    role: user.role,
    createdAt: user.createdAt,
  };
};

export const toReadUserDTOArray = <UserType extends ReadUserDTO>(
  users: UserType[]
): ReadUserDTO[] => {
  return users.map(toReadUserDTO);
};
