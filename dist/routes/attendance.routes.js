"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const attendance_controller_1 = require("../controllers/attendance.controller");
const router = (0, express_1.Router)();
// Get all attendance records
router.get("/", auth_middleware_1.authorized, attendance_controller_1.getAllClassAttendance);
// Get attendance by ID
router.get("/:id", auth_middleware_1.authorized, attendance_controller_1.getClassAttendanceById);
// Create new attendance
router.post("/", auth_middleware_1.authorized, attendance_controller_1.createClassAttendance);
// Update attendance
router.put("/:id", auth_middleware_1.authorized, attendance_controller_1.updateClassAttendance);
// Delete attendance
router.delete("/:id", auth_middleware_1.authorized, attendance_controller_1.deleteClassAttendance);
exports.default = router;
