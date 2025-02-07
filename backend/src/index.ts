import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { setIO } from './controllers/eventController';
import { User } from './models/User';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.IO setup with authentication
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Socket.IO middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      console.log('No token provided for socket connection');
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
      const user = await User.findById(decoded._id);

      if (!user) {
        console.log('User not found for socket connection');
        return next(new Error('User not found'));
      }

      console.log('Socket authenticated for user:', user.email);
      socket.data.user = user;
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      next(new Error('Invalid token'));
    }
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication failed'));
  }
});

// Set up Socket.IO in event controller
setIO(io);

// Express middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/upload', uploadRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Event Management API' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Socket.IO connection handling
io.on('connection', (socket) => {
  const user = socket.data.user;
  console.log('Client connected:', socket.id, 'User:', user?.email);

  // Join a room specific to this user
  socket.join(user._id.toString());

  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'User:', user?.email, 'Reason:', reason);
    socket.leave(user._id.toString());
  });

  socket.on('error', (error) => {
    console.error('Socket error for client:', socket.id, 'User:', user?.email, 'Error:', error);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 