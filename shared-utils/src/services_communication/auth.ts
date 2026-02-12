import axios from "axios";
import { IsAuthenticatedReqDTO, UserRole } from "shared-types";
import { AUTHENTICATION_SERVICE_URL } from "../constants";

export const isAuthenticated = async (
  userId: string,
  accessToken: string,
  allowedRoles: UserRole[]
): Promise<boolean> => {
  const res = await axios.post<boolean>(
    `${AUTHENTICATION_SERVICE_URL}/status/${userId}`,
    {
      accessToken,
      allowedRoles
    } as IsAuthenticatedReqDTO
  );
  return res.data;
};
