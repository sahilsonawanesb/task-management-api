# Task Management API Documentation

## Overview

The Task Management API is a RESTful service that allows users to create, read, update, and delete tasks. It provides comprehensive task management functionality with user authentication, logging, and advanced filtering capabilities.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Tasks](#tasks)
4. [Task Logs](#task-logs)
5. [Error Handling](#error-handling)
6. [Performance Considerations](#performance-considerations)
7. [Security Measures](#security-measures)
8. [API Reference](#api-reference)

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/task-management-api.git

# Navigate to the project directory
cd task-management-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit the .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/task-management
# JWT_SECRET=your_jwt_secret
# PORT=3000

# Start the server
npm start
```

## Authentication

The API uses JSON Web Tokens (JWT) for authentication. All authenticated endpoints require a valid token in the Authorization header.

### Register a New User

```
POST /api/auth/register
```

Request Body:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

Response (201 Created):
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "60a1c2b3d4e5f6a7b8c9d0e1",
    "username": "johndoe",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2023-05-13T12:34:56.789Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```
POST /api/auth/login
```

Request Body:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response (200 OK):
```json
{
  "message": "Login successful",
  "user": {
    "_id": "60a1c2b3d4e5f6a7b8c9d0e1",
    "username": "johndoe",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Tasks

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Create a Task

```
POST /api/task
```

Request Body:
```json
{
  "title": "Complete API documentation",
  "description": "Write comprehensive documentation for the Task Management API",
  "dueDate": "2023-06-01T12:00:00.000Z",
  "priority": "high",
  "status": "in_progress",
  "tags": ["documentation", "api"]
}
```

Response (201 Created):
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "61b2c3d4e5f6a7b8c9d0e1f2",
    "title": "Complete API documentation",
    "description": "Write comprehensive documentation for the Task Management API",
    "dueDate": "2023-06-01T12:00:00.000Z",
    "priority": "high",
    "status": "in_progress",
    "tags": ["documentation", "api"],
    "createdBy": "60a1c2b3d4e5f6a7b8c9d0e1",
    "createdAt": "2023-05-14T10:11:12.134Z",
    "updatedAt": "2023-05-14T10:11:12.134Z"
  }
}
```

### Get All Tasks

```
GET /api/task
```

Parameters:
- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 10): Number of items per page
- `status` (optional): Filter by status (pending, in_progress, completed)
- `priority` (optional): Filter by priority (low, medium, high)
- `sortBy` (optional): Field to sort by (createdAt, dueDate, priority)
- `sortOrder` (optional, default: desc): Sort order (asc, desc)
- `search` (optional): Search term to filter tasks by title or description

Example:
```
GET /api/task?page=1&limit=10&status=in_progress&priority=high&sortBy=dueDate&sortOrder=asc
```

Response (200 OK):
```json
{
  "tasks": [
    {
      "_id": "61b2c3d4e5f6a7b8c9d0e1f2",
      "title": "Complete API documentation",
      "description": "Write comprehensive documentation for the Task Management API",
      "dueDate": "2023-06-01T12:00:00.000Z",
      "priority": "high",
      "status": "in_progress",
      "tags": ["documentation", "api"],
      "createdBy": {
        "_id": "60a1c2b3d4e5f6a7b8c9d0e1",
        "name": "John Doe"
      },
      "createdAt": "2023-05-14T10:11:12.134Z",
      "updatedAt": "2023-05-14T10:11:12.134Z"
    },
    // More tasks...
  ],
  "pagination": {
    "totalTasks": 45,
    "totalPages": 5,
    "currentPage": 1,
    "limit": 10
  }
}
```

### Get Task by ID

```
GET /api/task/:id
```

Response (200 OK):
```json
{
  "task": {
    "_id": "61b2c3d4e5f6a7b8c9d0e1f2",
    "title": "Complete API documentation",
    "description": "Write comprehensive documentation for the Task Management API",
    "dueDate": "2023-06-01T12:00:00.000Z",
    "priority": "high",
    "status": "in_progress",
    "tags": ["documentation", "api"],
    "createdBy": {
      "_id": "60a1c2b3d4e5f6a7b8c9d0e1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2023-05-14T10:11:12.134Z",
    "updatedAt": "2023-05-14T10:11:12.134Z"
  }
}
```

### Update a Task

```
PUT /api/task/:id
```

Request Body (include only fields to update):
```json
{
  "status": "completed",
  "description": "Updated description with additional details"
}
```

Response (200 OK):
```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "61b2c3d4e5f6a7b8c9d0e1f2",
    "title": "Complete API documentation",
    "description": "Updated description with additional details",
    "dueDate": "2023-06-01T12:00:00.000Z",
    "priority": "high",
    "status": "completed",
    "tags": ["documentation", "api"],
    "createdBy": "60a1c2b3d4e5f6a7b8c9d0e1",
    "createdAt": "2023-05-14T10:11:12.134Z",
    "updatedAt": "2023-05-15T09:08:07.654Z"
  }
}
```

### Update Task Status

```
PUT /api/task/:id/status
```

Request Body:
```json
{
  "status": "completed"
}
```

Response (200 OK):
```json
{
  "message": "Task status updated successfully",
  "task": {
    "_id": "61b2c3d4e5f6a7b8c9d0e1f2",
    "title": "Complete API documentation",
    "status": "completed",
    "updatedAt": "2023-05-15T09:10:11.123Z"
  }
}
```

### Delete a Task

```
DELETE /api/task/:id
```

Response (200 OK):
```json
{
  "message": "Task deleted successfully"
}
```

## Task Logs

### Get Task Activity Logs

```
GET /api/task/:id/logs
```

Parameters:
- `limit` (optional, default: 20): Number of logs to return
- `skip` (optional, default: 0): Number of logs to skip

Response (200 OK):
```json
[
  {
    "_id": "62c3d4e5f6a7b8c9d0e1f2g3",
    "task": "61b2c3d4e5f6a7b8c9d0e1f2",
    "action": "created",
    "performedBy": {
      "_id": "60a1c2b3d4e5f6a7b8c9d0e1",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "previousState": null,
    "newState": {
      "title": "Complete API documentation",
      "description": "Write comprehensive documentation for the Task Management API",
      "status": "in_progress"
    },
    "createdAt": "2023-05-14T10:11:12.134Z"
  },
  {
    "_id": "63d4e5f6a7b8c9d0e1f2g3h4",
    "task": "61b2c3d4e5f6a7b8c9d0e1f2",
    "action": "status_changed",
    "performedBy": {
      "_id": "60a1c2b3d4e5f6a7b8c9d0e1",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "previousState": {
      "status": "in_progress"
    },
    "newState": {
      "status": "completed"
    },
    "details": "Status changed from in_progress to completed",
    "createdAt": "2023-05-15T09:10:11.123Z"
  }
]
```

## Error Handling

The API uses consistent error responses with appropriate HTTP status codes:

### Common Error Responses

#### Invalid Request (400 Bad Request)
```json
{
  "message": "Invalid request",
  "errors": [
    {
      "param": "email",
      "message": "Valid email is required"
    },
    {
      "param": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

#### Authentication Error (401 Unauthorized)
```json
{
  "message": "Authentication required",
  "error": "Invalid or expired token"
}
```

#### Permission Error (403 Forbidden)
```json
{
  "message": "Permission denied",
  "error": "You don't have permission to access this resource"
}
```

#### Not Found Error (404 Not Found)
```json
{
  "message": "Resource not found",
  "error": "The requested task doesn't exist"
}
```

#### Rate Limit Exceeded (429 Too Many Requests)
```json
{
  "message": "Too many requests",
  "error": "Rate limit exceeded. Try again in 15 minutes."
}
```

#### Server Error (500 Internal Server Error)
```json
{
  "message": "Internal server error",
  "error": "An unexpected error occurred"
}
```

## Performance Considerations

The API implements several performance optimizations:

1. **Database Indexing**:
   - Indexes on frequently queried fields (status, priority, createdBy, etc.)
   - Compound indexes for common query patterns
   - Text indexes for search functionality

2. **Query Optimization**:
   - Selective field projection
   - Lean queries where appropriate
   - Efficient pagination

3. **Caching**:
   - Cache headers for appropriate responses
   - In-memory caching for frequently accessed data

## Security Measures

The API implements the following security measures:

1. **Authentication**:
   - JWT-based authentication
   - Token expiration and refresh mechanisms
   - Secure cookie options

2. **Authorization**:
   - Role-based access control
   - Resource ownership validation

3. **Input Validation**:
   - Comprehensive request validation
   - Sanitization of all input data

4. **Rate Limiting**:
   - IP-based rate limiting
   - User-based rate limiting for authenticated requests

5. **Security Headers**:
   - CORS configuration
   - Content Security Policy
   - XSS Protection
   - HTTP Strict Transport Security

## API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Authenticate a user |
| POST | /api/auth/logout | Logout a user |
| POST | /api/auth/refresh-token | Refresh JWT token |
| GET | /api/auth/me | Get current user profile |

### Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/task | Get all tasks (with filtering) |
| POST | /api/task | Create a new task |
| GET | /api/task/:id | Get a task by ID |
| PUT | /api/task/:id | Update a task |
| DELETE | /api/task/:id | Delete a task |
| PUT | /api/task/:id/status | Update task status |
| GET | /api/task/:id/logs | Get task activity logs |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/user | Get all users (admin only) |
| GET | /api/user/:id | Get user by ID |
| PUT | /api/user/:id | Update user |
| DELETE | /api/user/:id | Delete user (admin only) |
| GET | /api/user/:id/tasks | Get tasks for a specific user |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/system/health | System health check |
| GET | /api/system/stats | System statistics (admin only) |
