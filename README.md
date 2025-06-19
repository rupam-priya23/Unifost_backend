# MERN Backend API

This is a Node.js backend API that uses MongoDB for data storage.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example` and fill in your environment variables:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

## Production Deployment on Railway

### Prerequisites
- A [Railway](https://railway.app/) account
- A MongoDB database (can be hosted on MongoDB Atlas or Railway)

### Deployment Steps

1. Push your code to a GitHub repository

2. Connect to Railway:
   - Create a new project on Railway
   - Select "Deploy from GitHub repo"
   - Select your repository

3. Add the required environment variables in Railway dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT generation
   - `FRONTEND_URL` - The URL of your frontend application
   - `NODE_ENV` - Set to `production`

4. Deploy your application
   - Railway will automatically deploy your application whenever you push to the main branch
   - You can also manually trigger deployments from the Railway dashboard

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login a user

### Enquiries
- GET `/api/enquiry` - Get all enquiries
- POST `/api/enquiry` - Create a new enquiry

### Leads
- GET `/api/leads` - Get all leads
- POST `/api/leads` - Create a new lead

## Environment Variables

| Variable      | Description                             | Default                  |
|---------------|-----------------------------------------|--------------------------|
| NODE_ENV      | Environment (development/production)    | development              |
| PORT          | Port to run server on                   | 5001                     |
| MONGODB_URI   | MongoDB connection string               | -                        |
| FRONTEND_URL  | Frontend URL for CORS                   | http://localhost:5173    |
| JWT_SECRET    | Secret for JWT tokens                   | -                        |
| JWT_EXPIRES_IN| JWT token expiration time              | 7d                       |

## Common Issues

### MongoDB Connection Issues on Railway
- Make sure to set the `MONGODB_URI` environment variable in Railway
- Ensure your MongoDB instance allows connections from Railway's IP ranges
- Use connection pooling with appropriate timeout settings (already configured in this app)

### CORS Issues
- Set the `FRONTEND_URL` environment variable to include all frontend URLs (comma-separated)
- Make sure frontend requests include credentials if needed

### JWT Authentication Issues
- Set a strong `JWT_SECRET` environment variable
- Make sure the token isn't expired (default expiration is 7 days)
