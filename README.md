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
git clone https://github.com/sahilsonawanesb/task-management-api.git

# Navigate to the project directory
cd task-management-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit the .env file with your configuration
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/task-management
# JWT_SECRET=your_jwt_secret
JWT_REFRESH_EXPIRATION=7d

# Start the server
npm start or
npx nodemon 
```
## Authentication

The API uses JSON Web Tokens (JWT) for authentication. All authenticated endpoints require a valid token in the Authorization header.

### Register a New User

```
POST /api/auth/sign-up
```
Request Body:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
}
```

Response (201 Created):
```json
{
    "message": "User Register Successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...iJrt7XDGHAvVtbaH8GRzbiJHUwmCJfr2Q1zKM",
    "user": {
        "id": "67b88870b453c6687039c65e",
        "username": "johndoe",
        "email": "john@example.com",
        "role": "securePassword123"
    }
}
```

### Login

```
POST /api/auth/sign-in
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
    "message": "Login Successful",
    "_id": "67b6d244d8a7a413..",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "....",
    "updatedAt": "....",
    "__v": 0
}
```

## Tasks

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Create a Task
```
POST /api/task/create
```

Request Body:
```json
{
    "title" : "Complete Task Application5",
    "description" : "Implment Authentication, task management and creation",
    "dueDate" : "2025-02-28T00:00:00Z",
    "assignedTo" : "67b6d244d8a7a413ce1,...a"
}
```

Response (201 Created):
```json
{
    "message": "Task created successfully",
    "task": {
        "title": "Complete Task Application5",
        "description": "Implment Authentication, task management and creation",
        "status": "Pending",
        "dueDate": "2025-02-28T00:00:00.000Z",
        "assignedTo": "67b6d244d8a.....",
        "createdBy": "67b6cf8341....",
        "_id": "67b88935b453c6687039c664",
        "createdAt": "2025-02-21T14:09:57.029Z",
        "updatedAt": "2025-02-21T14:09:57.029Z",
        "__v": 0
    }
}
```

### Get All & user Specific Tasks

```
GET /api/task/getTask
```
Response (200 OK):
```json
  {
        "_id": "67b7626434289b317cf8aee8",
        "title": "Complete Notification System for Task management",
        "description": "Implment Notification system for creation, task management and creation",
        "status": "Completed",
        "dueDate": "2025-02-28T00:00:00.000Z",
        "assignedTo": {
            "_id": "67b6d244d8a7a413ce190eca",
            "username": "johndoe",
            "email": "johndoe@gmail.com"
        },
        "createdBy": {
            "_id": "67b6cf8341a31e1fec086dd6",
            "username": "johndoe",
            "email": "johndoe@gmail.com"
        },
        "createdAt": "2025-02-20T17:12:04.350Z",
        "updatedAt": "2025-02-20T17:20:35.792Z",
        "__v": 0
    },
```

### Update Task by ID

```
PUT /api/task/updateTask/:id
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
    "message": "Task updated sucessfully",
    "updateTask": {
        "_id": "67b7723b46d9c33061412f57",
        "title": "Complete Task Application",
        "description": "Complete Authentication, task management and creation",
        "status": "In Progress",
        "dueDate": "2025-02-28T00:00:00.000Z",
        "assignedTo": "67b6d244d8a7a413ce190eca",
        "createdBy": "67b6cf8341a31e1fec086dd6",
        "createdAt": "2025-02-20T18:19:39.114Z",
        "updatedAt": "2025-02-21T14:16:08.220Z",
        "__v": 0
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
    "message": "Task status update successfull",
    "task": {
        "_id": "67b7723b46d9c33061412f57",
        "title": "Complete Task Application",
        "description": "Complete Authentication, task management and creation",
        "status": "Completed",
        "dueDate": "2025-02-28T00:00:00.000Z",
        "assignedTo": "67b6d244d8a7a413ce190eca",
        "createdBy": "67b6cf8341a31e1fec086dd6",
        "createdAt": "2025-02-20T18:19:39.114Z",
        "updatedAt": "2025-02-21T14:17:01.968Z",
        "__v": 0
    }
}
```

### Delete a Task

```
DELETE /api/task/deteleTask/:id
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

## API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/sign-up | Register a new user |
| POST | /api/auth/sign | Authenticate a user |
| POST | /api/auth/signout | Logout a user |
| GET | /api/auth/getUser | Get current user profile |

### Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/task/getTask | Get all tasks |
| POST | /api/task/create | Create a new task |
| PUT | /api/task/updateTask/:id | Update a task |
| DELETE | /api/task/deleteTask/:id | Delete a task |
| PUT | /api/task/:id/status | Update task status |
| GET | /api/task/:id/logs | Get task activity logs |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/user/getUsers | Get all users (admin only) |
| PUT | /api/user/update/:id | Update user |
| DELETE | /api/user/delete/:id | Delete user (admin only) |
| GET | /api/task/getTask | Get tasks for a specific user |

### Notification Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notifications/ | Get all notifications (user only) |
| PATCH | /api/notifications/read-all | Read All notification |
| PATCH | /api/notifications/:id/read | Read Specific notification (admin only) |

### Logs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/user/:id/logs | Get User Action Logs  |
| GET | /api/task/:id/logs | Get Task Logs |



## Error Handling

The API uses consistent error responses with appropriate HTTP status codes:

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


## Security Measures

The API implements the following security measures:

1. **Authentication**:
   - JWT-based authentication
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


