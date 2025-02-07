# Event Management System

A full-stack web application for managing events, built with React, TypeScript, Node.js, and MongoDB.

## Features

- User Authentication (Register, Login, Guest Access)
- Event Management (Create, Read, Update, Delete)
- Real-time Updates using Socket.IO
- Event Filtering and Search
- Responsive Design
- Image Upload Support

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Socket.IO Client for real-time features
- Axios for API calls
- React Router for navigation
- Headless UI for components

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Socket.IO for real-time updates
- JWT for authentication
- Bcrypt for password hashing

## Live Demo

- Frontend: [Vercel URL - Coming Soon]
- Backend API: [Render URL - Coming Soon]

### Test Credentials
```
Regular User:
Email: test@example.com
Password: test123

Guest User:
Use the "Continue as Guest" option
```

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Environment Variables

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

#### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd [repository-name]
```

2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

3. Install Backend Dependencies
```bash
cd backend
npm install
```

4. Start Development Servers

Frontend:
```bash
cd frontend
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy using Vercel's automatic deployment

### Backend (Render)
1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy using Render's automatic deployment

### Database (MongoDB Atlas)
1. Create a free cluster
2. Set up database access
3. Configure network access
4. Get connection string and update backend .env

### Image Storage (Cloudinary)
1. Create a free Cloudinary account
2. Get API credentials
3. Update backend .env with Cloudinary credentials

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/guest-login - Guest login
- GET /api/auth/profile - Get user profile

### Event Endpoints
- GET /api/events - Get all events
- POST /api/events - Create new event
- GET /api/events/:id - Get single event
- PUT /api/events/:id - Update event
- DELETE /api/events/:id - Delete event
- POST /api/events/:id/join - Join event
- POST /api/events/:id/leave - Leave event

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 