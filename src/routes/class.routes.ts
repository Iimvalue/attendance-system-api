import { Router } from "express"
import * as ClassController from "../controllers/class.controller"
import * as ClassAttendanceController from "../controllers/attendance.controller"
import { authorized } from '../middleware/auth.middleware';

const router = Router()

router.post("/", authorized, ClassController.createClass)

router.get("/", authorized, ClassController.getAllClasses)

router.get("/teacher/:userId", ClassController.getClassesByTeacher)
router.post("/attendance", ClassAttendanceController.createClassAttendance)
router.get("/attendance", ClassAttendanceController.getAllClassAttendance)
router.get("/attendance/:id", ClassAttendanceController.getClassAttendanceById)
router.put("/attendance/:id", ClassAttendanceController.updateClassAttendance)
router.delete("/attendance/:id", ClassAttendanceController.deleteClassAttendance)



router.get("/:id", ClassController.getClassById)

router.put("/:id", ClassController.updateClass)

router.delete("/:id", ClassController.deleteClass)

router.post("/", ClassController.createClass)

// Attendance Routes
// router.get("/:id/attendance", ClassController.getClassAttendanceById)
// router.put("/:id/attendance", ClassController.updateClassAttendanceById)
// router.delete("/:id/attendance", ClassController.deleteClassAttendanceById)

export default router
