import { CreateUserDTO, ReadUserDTO } from "shared-types";
import * as authService from "../../services_communication/auth"; 

export class AuthService {
  constructor(private saveUser: (user: ReadUserDTO | null) => void ) {}

  public async signUp(createUserDTO: CreateUserDTO): Promise<void> {
    const user = await authService.signUp(createUserDTO);
    this.saveUser(user);
  }

  public async signIn(email: string, password: string): Promise<void> {
    const user = await authService.signIn({ email, password });
    this.saveUser(user);
  }

  public async signOut(userId: string): Promise<void> {
    await authService.signOut(userId);
    this.saveUser(null);
  }

  public async refreshAccess(
    userId: string
  ): Promise<void> {
    await authService.refreshAccess(userId);
  }
}
