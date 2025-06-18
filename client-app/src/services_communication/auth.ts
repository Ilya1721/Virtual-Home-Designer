import axios from "axios";
import {
  AuthenticateUserDTO,
  CreateUserDTO,
  ReadUserDTO,
} from "shared-types";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

export const signUp = async (user: CreateUserDTO): Promise<ReadUserDTO> => {
  const res = await axios.post<ReadUserDTO>(`${AUTH_SERVICE_URL}/signup`, user);
  return res.data;
};

export const signIn = async (
  signInDTO: AuthenticateUserDTO
): Promise<ReadUserDTO> => {
  const { email, password } = signInDTO;
  const res = await axios.post<ReadUserDTO>(`${AUTH_SERVICE_URL}/signin`, {
    email,
    password,
  });
  return res.data;
};

export const signOut = async (userId: string): Promise<void> => {
  await axios.post(`${AUTH_SERVICE_URL}/signout/${userId}`);
};

export const refreshAccess = async (userId: string): Promise<void> => {
  await axios.post(
    `${AUTH_SERVICE_URL}/${userId}/refresh`,
    { withCredentials: true }
  );
};
