import { Router } from "express"
import * as UserController from "../controllers/users.controller"
import { authorized } from "../middleware/auth.middleware"

const router = Router()

// Public routes

// Authorized routes
router.post("/", authorized, UserController.createUser)
router.get("/", authorized, UserController.readUsers)
router.get("/user/:id", authorized, UserController.readUser)
router.put("/update/:id", authorized, UserController.updateUser)
router.get("/principle", authorized, UserController.readTeacherAndStudents)
router.get("/teacher", authorized, UserController.readUsers)
router.delete("/delete", authorized, UserController.deleteUser)

export default router
