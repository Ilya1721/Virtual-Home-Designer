import { AbstractResponse } from "shared-types";

export type CookieOptions = {
  maxAge?: number;
  path?: string;
};

export class CookieManager {
  constructor(
    private cookieName: string,
    private options: CookieOptions
  ) {}

  public saveCookie(cookieValue: string, res: AbstractResponse<any, unknown>): void {
    res.cookie(this.cookieName, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: this.options.path,
      maxAge: this.options.maxAge
    });
  }

  public expireCookie(res: AbstractResponse<any, unknown>): void {
    res.cookie(this.cookieName, "", {
      path: this.options.path,
      maxAge: 0
    });
  }
}
