import { Router } from "express"
import * as ClassController from "../controllers/class.controller"
import * as ClassAttendanceController from "../controllers/attendance.controller"
import { authorized, restrictTo } from "../middleware/auth.middleware"

const router = Router()

router.post("/", authorized, restrictTo('admin'), ClassController.createClass)
router.get("/", authorized, restrictTo('admin', 'teacher', 'student'), ClassController.getAllClasses) 
router.get("/teacher/:userId", authorized, restrictTo('admin', 'teacher'), ClassController.getClassesByTeacher)
router.get("/:id", authorized, restrictTo('admin', 'teacher', 'student'), ClassController.getClassById)
router.put("/:id", authorized, restrictTo('admin', 'teacher'), ClassController.updateClass)
router.delete("/:id", authorized, restrictTo('admin'), ClassController.deleteClass) 

router.post("/attendance", authorized, restrictTo('admin', 'teacher'), ClassAttendanceController.createClassAttendance)
router.get("/attendance", authorized, restrictTo('admin', 'teacher'), ClassAttendanceController.getAllClassAttendance)
router.get("/attendance/:id", authorized, restrictTo('admin', 'teacher', 'student'), ClassAttendanceController.getClassAttendanceById)
router.put("/attendance/:id", authorized, restrictTo('admin', 'teacher'), ClassAttendanceController.updateClassAttendance)
router.delete("/attendance/:id", authorized, restrictTo('admin', 'teacher'), ClassAttendanceController.deleteClassAttendance)

// Attendance Routes
// router.get("/:id/attendance", ClassController.getClassAttendanceById)
// router.put("/:id/attendance", ClassController.updateClassAttendanceById)
// router.delete("/:id/attendance", ClassController.deleteClassAttendanceById)

export default router
