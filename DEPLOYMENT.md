# Deployment Instructions

This document provides detailed instructions for deploying the Event Management Platform to production using Vercel (frontend), Render (backend), MongoDB Atlas (database), and Cloudinary (image storage).

## Prerequisites

1. Accounts needed:

   - [Vercel Account](https://vercel.com)
   - [Render Account](https://render.com)
   - [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
   - [Cloudinary Account](https://cloudinary.com)
   - [GitHub Account](https://github.com)

2. Your codebase should be pushed to a GitHub repository with two main directories:
   - `frontend/` - Contains the React application
   - `backend/` - Contains the Node.js/Express server

## 1. MongoDB Atlas Setup

1. Create a new project in MongoDB Atlas
2. Build a new cluster (free tier is sufficient to start)
3. Set up database access:
   - Create a new database user
   - Use a strong password
   - Give appropriate read/write permissions
4. Configure network access:
   - Add `0.0.0.0/0` to IP whitelist for production
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Save this URI for later use in backend environment variables

## 2. Cloudinary Setup

1. Create a new Cloudinary account or log in
2. From your dashboard, collect the following credentials:
   - Cloud Name
   - API Key
   - API Secret
3. Save these credentials for later use in backend environment variables

## 3. Backend Deployment (Render)

1. Log in to Render and create a new Web Service
2. Connect your GitHub repository
3. Configure the service:

   - Name: `event-management-backend` (or your preferred name)
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Select appropriate instance type (free tier is fine for testing)

4. Add the following environment variables in Render:

   ```
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_very_long_random_secret_key
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=production
   ```

5. Deploy the service and note down your Render URL (e.g., `https://event-management-backend.onrender.com`)

## 4. Frontend Deployment (Vercel)

1. Log in to Vercel and create a new project
2. Import your GitHub repository
3. Configure the project:

   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. Add the following environment variables in Vercel:

   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```

5. Deploy the project

## 5. Final Configuration Steps

1. Update CORS settings:

   - In your backend environment variables on Render, update `CORS_ORIGIN` to match your Vercel deployment URL

2. Test the deployment:
   - Register a new user
   - Test image upload
   - Create and join events
   - Verify real-time updates work

## Environment Variables Reference

### Backend (Render)

```
PORT=10000
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database
JWT_SECRET=your_very_long_random_secret_key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
```

### Frontend (Vercel)

```
VITE_API_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

## Security Considerations

1. JWT Secret:

   - Use a strong, random string for JWT_SECRET
   - Minimum 32 characters recommended
   - Never share or commit this value

2. MongoDB:

   - Use a strong password for your database user
   - Regularly rotate credentials
   - Monitor database access logs

3. Cloudinary:

   - Restrict upload formats if needed
   - Set up upload presets for additional security
   - Monitor usage and set up alerts

4. CORS:
   - Keep CORS_ORIGIN restricted to your frontend domain
   - Don't use wildcard (\*) in production

## Troubleshooting

1. If real-time updates not working:

   - Verify VITE_SOCKET_URL is correct
   - Check if WebSocket connections are allowed by your firewall
   - Verify CORS settings

2. If image upload fails:

   - Verify Cloudinary credentials
   - Check upload size limits
   - Verify network connectivity

3. If authentication fails:
   - Verify JWT_SECRET is set correctly
   - Check if tokens are being passed correctly
   - Verify CORS settings

## Monitoring and Maintenance

1. Set up monitoring:

   - Use Render's built-in monitoring
   - Set up MongoDB Atlas monitoring
   - Monitor Cloudinary usage

2. Regular maintenance:
   - Keep dependencies updated
   - Monitor error logs
   - Backup database regularly
   - Rotate credentials periodically

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

For any issues:

1. Check the respective platform's status pages
2. Review application logs
3. Consult the platform-specific documentation
4. Contact platform support if needed
