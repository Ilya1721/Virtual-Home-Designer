import axios from "axios";
import { CreateUserDTO, ReadUserDTO } from "shared-types";

const API_URL = process.env.USER_MANAGEMENT_URL;

export const createUser = async (user: CreateUserDTO): Promise<ReadUserDTO> => {
  const res = await axios.post<ReadUserDTO>(`${API_URL}/users`, user);
  return res.data;
}

export const authenticateUser = async (email: string, password: string): Promise<ReadUserDTO> => {
  const res = await axios.post<ReadUserDTO>(`${API_URL}/signin`, { email, password });
  return res.data;
}