import { UserRole } from "shared-types";
import * as AbstractMiddleware from "../middleware";
import { NextFunction } from "express";
import { getReqResPair } from "./RequestResponse";

export const requireAuthentication = (...allowedRoles: UserRole[]) => {
  return async (
    req: any,
    res: any,
    next: NextFunction
  ): Promise<void> => {
    try {
      const [abstractReq, abstractRes] = getReqResPair(req, res);
      await AbstractMiddleware.requireAuthentication(abstractReq, abstractRes, allowedRoles);
      next();
    } catch (err) {
      next(err);
    }
  };
};
