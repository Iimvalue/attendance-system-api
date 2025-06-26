import { Router } from "express"
import * as UserController from "../controllers/users.controller"
import { authorized, restrictTo } from "../middleware/auth.middleware"

const router = Router()

// Public routes

// Authorized routes - with role restrictions
router.post("/", authorized, restrictTo('admin'), UserController.createUser) // Only admin can create users
router.get("/", authorized, restrictTo('admin', 'teacher'), UserController.readUsers) // Admin and teachers can view all users
router.get("/user/:id", authorized, UserController.readUser) // Any authenticated user can view their own profile
router.put("/update/:id", authorized, UserController.updateUser) // Users can update their own profile (add logic in controller)
router.get("/principle", authorized, restrictTo('admin'), UserController.readTeacherAndStudents) // Only admin/principle can view this
router.get("/teacher", authorized, restrictTo('admin', 'teacher'), UserController.readUsers) // Admin and teachers only
router.delete("/delete", authorized, restrictTo('admin'), UserController.deleteUser) // Only admin can delete users

export default router
