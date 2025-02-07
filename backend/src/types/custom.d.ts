import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user: IUser & { _id: Types.ObjectId };
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: Types.ObjectId };
    }
  }
}

export type AsyncRequestHandler = (
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type UploadedFile = Express.Multer.File;
