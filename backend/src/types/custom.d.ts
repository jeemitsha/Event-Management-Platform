import { Request } from "express";
import { Types } from "mongoose";
import { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user: IUser & { _id: Types.ObjectId };
}
