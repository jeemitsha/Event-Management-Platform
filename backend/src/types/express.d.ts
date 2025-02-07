import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
    interface Response {
      // Add any custom response extensions here
    }
  }
}

export interface AuthRequest extends Request {
  user: IUser;
}
