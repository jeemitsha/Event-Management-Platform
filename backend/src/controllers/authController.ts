import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

const generateToken = (user: IUser): string => {
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      res.status(400).json({ error: 'Please enter a valid email address' });
      return;
    }

    // Validate password length
    if (!password || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();
    const token = generateToken(user);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      res.status(400).json({ error: 'Please enter a valid email address' });
      return;
    }

    // Validate password length
    if (!password || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
};

export const guestLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      res.status(400).json({ error: 'Please enter a valid email address' });
      return;
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists. Please use a different email.' });
      return;
    }

    // Generate a random password for the guest user
    const randomPassword = Math.random().toString(36).slice(-8);

    const user = new User({
      name: 'Guest User',
      email: email.trim().toLowerCase(),
      password: randomPassword,
      isGuest: true
    });

    await user.save();
    const token = generateToken(user);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest
      },
      token
    });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(400).json({ error: 'Guest login failed' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isGuest: user.isGuest
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to get profile' });
  }
}; 