import { Router } from "express"
import * as UserController from "../controllers/users.controller"
import { authorized, restrictTo } from "../middleware/auth.middleware"

const router = Router()


router.post("/", authorized, restrictTo('admin', 'principle'), UserController.createUser) 
router.get("/", authorized, restrictTo('admin', 'principle', 'teacher'), UserController.readUsers) 
router.get("/user/:id", authorized, UserController.readUser) 
router.put("/update/:id", authorized, UserController.updateUser) 
router.get("/principle", authorized, restrictTo('admin', 'principle'), UserController.readTeacherAndStudents) 
router.get("/teacher", authorized, restrictTo('admin', 'principle', 'teacher'), UserController.readUsers) 
router.delete("/delete", authorized, restrictTo('admin', 'principle'), UserController.deleteUser) 

export default router
