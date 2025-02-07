import { Types } from "mongoose";
import { IUser } from "../../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: Types.ObjectId };
      body: any;
      params: any;
    }
  }
}

// Extend AuthRequest from Express.Request
export interface AuthRequest extends Express.Request {
  user: IUser & { _id: Types.ObjectId };
}
