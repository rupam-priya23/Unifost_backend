# API Endpoints Quick Reference

## Base URL
```
https://mern-backend-production-a933.up.railway.app
```

## Authentication
- **Register**: `POST /api/auth/register`
  ```json
  {"name": "Name", "email": "email@example.com", "phone": "1234567890", "dob": "1990-01-01", "gender": "male", "course": "Course Name", "password": "password123", "university": "University Name"}
  ```

- **Login**: `POST /api/auth/login`
  ```json
  {"email": "email@example.com", "password": "password123"}
  ```

- **Logout**: `POST /api/auth/logout`

## Enquiries
- **Submit Enquiry**: `POST /api/enquiry/enquiry`
  ```json
  {"name": "Name", "email": "email@example.com", "phone": "9876543210", "course": "Course", "university": "University", "message": "Message"}
  ```

## Leads
- **Get All Leads**: `GET /api/leads`
  - Requires Auth: `Authorization: Bearer <token>`

## Health Checks
- **API Status**: `GET /health`
- **DB Status**: `GET /health/db`

## Authentication Format
- Bearer Token: `Authorization: Bearer <JWT_TOKEN>`

## Response Format
- Success: `{"success": true, ...}`
- Error: `{"success": false, "message": "Error message"}`
