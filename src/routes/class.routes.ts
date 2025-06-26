import { Router } from "express"
import * as ClassController from "../controllers/class.controller"
import * as ClassAttendanceController from "../controllers/attendance.controller"
import { authorized, restrictTo } from "../middleware/auth.middleware"

const router = Router()

router.post("/", authorized, restrictTo('admin', 'principle'), ClassController.createClass)
router.get("/", authorized, restrictTo('admin', 'principle', 'teacher', 'student'), ClassController.getAllClasses) 
router.get("/teacher/:userId", authorized, restrictTo('admin', 'principle', 'teacher'), ClassController.getClassesByTeacher)
router.get("/:id", authorized, restrictTo('admin', 'principle', 'teacher', 'student'), ClassController.getClassById)
router.put("/:id", authorized, restrictTo('admin', 'principle', 'teacher'), ClassController.updateClass)
router.delete("/:id", authorized, restrictTo('admin', 'principle'), ClassController.deleteClass) 

router.post("/attendance", authorized, restrictTo('admin', 'principle', 'teacher'), ClassAttendanceController.createClassAttendance)
router.get("/attendance", authorized, restrictTo('admin', 'principle', 'teacher'), ClassAttendanceController.getAllClassAttendance)
router.get("/attendance/:id", authorized, restrictTo('admin', 'principle', 'teacher', 'student'), ClassAttendanceController.getClassAttendanceById)
router.put("/attendance/:id", authorized, restrictTo('admin', 'principle', 'teacher'), ClassAttendanceController.updateClassAttendance)
router.delete("/attendance/:id", authorized, restrictTo('admin', 'principle', 'teacher'), ClassAttendanceController.deleteClassAttendance)

export default router
