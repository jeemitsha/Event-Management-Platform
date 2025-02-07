import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';
import { User, IUser } from '../models/User';
import { AuthRequest } from '../types/express';

export interface AuthRequest extends Request {
  user: Document<unknown, any, IUser> & IUser & { _id: mongoose.Types.ObjectId };
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
    const user = await User.findById(decoded._id);

    if (!user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication required' });
  }
};

export const guestAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
      const user = await User.findOne({ _id: decoded._id });
      if (user) {
        (req as AuthRequest).user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
}; 