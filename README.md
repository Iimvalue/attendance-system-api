# Attendance System API Endpoints

A Node.js/Express API for ِAttendance with authentication, user management, class management, and enrollment features.


## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`
5. The API will be available at `http://localhost:3000`

## Base URL
```
http://localhost:3000/api
```

## Authentication

The API uses JWT tokens for authentication. Tokens are stored in HTTP-only cookies and also returned in response bodies.

### Cookie Names
- `accessToken` - Short-lived token (15 minutes)
- `refreshToken` - Long-lived token (7 days)

---

## 🔐 Authentication Routes (`/api/auth`)

### Sign Up
```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Sign In
```http
POST /api/auth/signin
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Sign Out
```http
POST /api/auth/signout
```

### Refresh Token
```http
POST /api/auth/refresh-token
```

**Request Body (optional - can use cookie):**
```json
{
  "refreshToken": "refresh_token"
}
```

### Delete Account (🔒 Authenticated)
```http
DELETE /api/auth/delete-account
```

**Headers:**
```
Authorization: Bearer jwt_token
```

---

## 👥 User Management Routes (`/api/users`)

All user routes require authentication.

### Create User (🔒 Admin Only)
```http
POST /api/users
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "student"
}
```

**Valid Roles:** `admin`, `teacher`, `student`, `principle`

### Get All Users (🔒 Authenticated)
```http
GET /api/users
```

### Get User by ID (🔒 Authenticated)
```http
GET /api/users/user/:id
```

### Update User (🔒 Authenticated)
```http
PUT /api/users/update/:id
```

**Request Body:**
```json
{
  "email": "updated@example.com",
  "password": "newpassword123",
  "role": "teacher"
}
```

### Get Teachers and Students for principle (🔒 Authenticated)
```http
GET /api/users/principle
```

### Delete User (🔒 Authenticated)
```http
DELETE /api/users/delete
```

---

## 📚 Class Management Routes (`/api/classes`)

### Create Class
```http
POST /api/classes
```

**Request Body:**
```json
{
  "name": "Mathematics 101",
  "userId": "teacher_user_id",
  "description": "Basic mathematics course",
  "location": "Room 101",
  "capacity": 30,
  "dateStartAt": "2024-01-01",
  "dateEndAt": "2024-06-01",
  "timeStartAt": 9,
  "timeEndAt": 11
}
```

### Get All Classes
```http
GET /api/classes
```

### Get Class by ID
```http
GET /api/classes/:id
```

### Get Classes by Teacher
```http
GET /api/classes/teacher/:userId
```

### Update Class
```http
PUT /api/classes/:id
```

**Request Body:**
```json
{
  "name": "Advanced Mathematics",
  "description": "Advanced mathematics course",
  "capacity": 25
}
```

### Delete Class
```http
DELETE /api/classes/:id
```

---

## 📝 Attendance Routes (`/api/classes/attendance`)

### Create Attendance
```http
POST /api/classes/attendance
```

**Request Body:**
```json
{
  "classId": "class_id",
  "attendeeId": "student_user_id",
  "attenderId": "teacher_user_id",
  "status": "present"
}
```

**Valid Status Values:** `present`, `absent`, `late`, `excused`

### Get All Attendance
```http
GET /api/classes/attendance
```

### Get Attendance by ID
```http
GET /api/classes/attendance/:id
```

### Update Attendance
```http
PUT /api/classes/attendance/:id
```

**Request Body:**
```json
{
  "status": "late",
  "attendeeAt": "2024-01-01T10:15:00.000Z"
}
```

### Delete Attendance
```http
DELETE /api/classes/attendance/:id
```

---

## 📋 Enrollment Routes (`/api/enrollments`)

### Create Enrollment
```http
POST /api/enrollments
```

**Request Body:**
```json
{
  "classId": "class_id",
  "userId": "student_user_id"
}
```

### Get All Enrollments
```http
GET /api/enrollments
```

### Get Enrollments by Class
```http
GET /api/enrollments/class/:classId
```

### Get Enrollments by User (Student's Classes)
```http
GET /api/enrollments/user/:userId
```

### Get Students by Teacher
```http
GET /api/enrollments/teacher/:teacherId/students
```

### Get Enrollment by ID
```http
GET /api/enrollments/:id
```

### Update Enrollment
```http
PUT /api/enrollments/:id
```

**Request Body:**
```json
{
  "classId": "new_class_id"
}
```

### Delete Enrollment
```http
DELETE /api/enrollments/:id
```

---

## 🔑 Environment Variables

```env
PORT=3000
NODE_ENV=development
MONGODB_URI="mongodb+srv://root:toor@cluster0.f26ll8w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET=44af39430fd8422e99d609b71446620d
WEATHER_API_KEY=14df133164d383f2d81596f94db3db7d
```

---

## ⚠️ Important Notes

1. **Authentication**: Most endpoints require authentication. Include cookies in requests.
2. **Date Format**: Dates should be in ISO format (`YYYY-MM-DD` or full ISO string).
3. **Time Format**: Times are in 24-hour format (0-23).
4. **Role Permissions**: Some endpoints require specific roles (admin, teacher).
5. **Validation**: The API validates all required fields and returns appropriate error messages.
6. **Attendance Constraints**: Only one attendance record per student per day per class.