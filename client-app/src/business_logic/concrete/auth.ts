import { CreateUserDTO } from "shared-types";
import * as authService from "../../services_communication/auth";
import { UserStorage } from "../abstract/UserStorage";

export class AuthService {
  constructor(private userStorage: UserStorage) {}

  public async signUp(createUserDTO: CreateUserDTO): Promise<void> {
    const user = await authService.signUp(createUserDTO);
    this.userStorage.saveUser(user);
  }

  public async signIn(email: string, password: string): Promise<void> {
    const user = await authService.signIn({ email, password });
    this.userStorage.saveUser(user);
  }

  public async signOut(userId: string): Promise<void> {
    await authService.signOut(userId);
    this.userStorage.clearUser();
  }

  public async refreshAccess(
    userId: string
  ): Promise<void> {
    await authService.refreshAccess(userId);
  }
}
