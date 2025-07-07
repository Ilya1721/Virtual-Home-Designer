import axios from "axios";
import { HttpStatus } from "shared-types";
import { AuthService } from "./auth";

export const setUpAxiosResponseInterceptor = (
  authService: AuthService,
  userId: string | undefined
) => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const errorStatus = error.response?.status;
      if (errorStatus === HttpStatus.LOGIN_TIMEOUT) {
        return await authService.signOut(userId);
      } else if (errorStatus === HttpStatus.UNAUTHORIZED) {
        await authService.refreshAccess(userId);
        return axios(error.config);
      }
      throw error;
    }
  );
};
