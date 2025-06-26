import { Router } from "express"
import { authorized } from "../middleware/auth.middleware"
import {
  getAllClassAttendance,
  getClassAttendanceById,
  createClassAttendance,
  updateClassAttendance,
  deleteClassAttendance,
} from "../controllers/attendance.controller"

const router = Router()

// Get all attendance records
router.get("/", authorized, getAllClassAttendance)

// Get attendance by ID
router.get("/:id", authorized, getClassAttendanceById)

// Create new attendance
router.post("/", authorized, createClassAttendance)

// Update attendance
router.put("/:id", authorized, updateClassAttendance)

// Delete attendance
router.delete("/:id", authorized, deleteClassAttendance)

export default router
