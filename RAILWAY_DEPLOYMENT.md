# Railway Deployment Guide

This guide will walk you through how to deploy this Node.js and MongoDB API on [Railway](https://railway.app/).

## Prerequisites

1. A Railway account (can be created at [railway.app](https://railway.app/))
2. Your code pushed to a GitHub repository
3. A MongoDB database (you can use MongoDB Atlas or Railway's MongoDB service)

## Step 1: Set Up MongoDB

### Option A: Using MongoDB Atlas

1. Create a MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Configure network access to allow connections from anywhere (0.0.0.0/0)
4. Create a database user with read and write privileges
5. Obtain your connection string, which will look something like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/your-db-name
   ```

### Option B: Using Railway MongoDB Plugin

1. In your Railway project, click "Add plugin"
2. Select MongoDB
3. Railway will automatically provision a MongoDB instance
4. You can find the connection string in the "Connect" tab

## Step 2: Deploy Your API on Railway

1. Create a new project on Railway
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account (if not already connected)
4. Select the repository that contains your API code
5. Click "Deploy Now"

## Step 3: Configure Environment Variables

Add the following environment variables in Railway project settings:

- `NODE_ENV`: Set to `production`
- `MONGODB_URI`: Your MongoDB connection string from Step 1
- `JWT_SECRET`: A long, random string for JWT generation
- `JWT_EXPIRES_IN`: Time duration for JWT expiration (e.g., `7d`)
- `FRONTEND_URL`: The URL of your frontend application

## Step 4: Database Connection Verification

1. Once deployed, go to your project logs in Railway
2. Verify that you see the message "MongoDB connected successfully"
3. If you see any connection errors, check your MongoDB connection string and network settings

## Step 5: Test the API

1. Your API will be deployed at a URL provided by Railway (e.g., https://your-api.railway.app)
2. Test the root endpoint (/) to verify the API is running:
   ```
   curl https://your-api.railway.app/
   ```
   You should see a response indicating the API is running

3. Test the login endpoint:
   ```
   curl -X POST https://your-api.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"yourpassword"}'
   ```

## Troubleshooting Railway Deployment

### MongoDB Connection Issues

- Ensure your MongoDB URI is correctly formatted
- Make sure your MongoDB instance allows connections from Railway's IP range
- Check for connectivity issues in Railway logs

### Application Errors

- Review application logs in Railway dashboard
- Look for specific error messages in the console
- Verify all required environment variables are set

### CORS Issues

- Check that your FRONTEND_URL is correctly set in environment variables
- Ensure all frontend origins are included in the FRONTEND_URL (comma-separated)
- Verify your frontend is sending credentials with requests if needed

### JWT Issues

- Make sure JWT_SECRET is set in environment variables
- Verify JWT_EXPIRES_IN is set to a valid duration

## Railway Commands

- Auto-deploy with GitHub: Railway will automatically deploy when you push to the connected branch
- Manual deploy: You can trigger deployments manually from the Railway dashboard
- Viewing logs: Logs are accessible in the Railway project dashboard

## Additional Resources

- Railway Documentation: https://docs.railway.app/
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- JWT Documentation: https://jwt.io/

## Support

If you encounter any issues while deploying, please contact the development team.
