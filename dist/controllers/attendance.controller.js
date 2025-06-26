"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClassAttendance = exports.updateClassAttendance = exports.getClassAttendanceById = exports.createClassAttendance = exports.getAllClassAttendance = void 0;
const attendance_model_1 = require("../models/attendance.model");
const user_model_1 = require("../models/user.model");
const http_status_1 = require("../utils/http-status");
const getAllClassAttendance = async (req, res) => {
    try {
        const classes = await attendance_model_1.AttendanceCollection.find().sort({ createdAt: -1 });
        const total = await attendance_model_1.AttendanceCollection.countDocuments();
        res.status(http_status_1.OK).json({
            status: "success",
            data: { classes, total },
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
exports.getAllClassAttendance = getAllClassAttendance;
const getClassAttendanceById = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ObjectId format
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "error",
                message: "Invalid attendance ID format",
            });
        }
        // Find attendance by ID and populate user data
        const attendance = await attendance_model_1.AttendanceCollection.findById(id)
            .populate({
            path: "attendeeId",
            model: "Users",
            select: "email role createdAt updatedAt",
        })
            .populate({
            path: "attenderId",
            model: "Users",
            select: "email role createdAt updatedAt",
        });
        if (!attendance) {
            res.status(http_status_1.NOT_FOUND).json({
                status: "error",
                message: "Attendance record not found",
            });
        }
        res.status(http_status_1.OK).json({
            status: "success",
            data: { attendance },
        });
    }
    catch (error) {
        console.error("Error in getClassAttendanceById:", error);
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
exports.getClassAttendanceById = getClassAttendanceById;
const createClassAttendance = async (req, res) => {
    try {
        const { classId, attendeeId, status = "present", attenderId: bodyAttenderId, } = req.body;
        // Check if user is authenticated, otherwise use attenderId from body
        const attenderId = req.user?._id || bodyAttenderId;
        // Validate required fields
        if (!classId || !attendeeId || !attenderId) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "error",
                message: "classId, attendeeId, and attenderId are required",
            });
        }
        // Validate status
        const validStatuses = ["present", "absent", "late", "excused"];
        if (!validStatuses.includes(status)) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "error",
                message: "Status must be one of: present, absent, late, excused",
            });
        }
        // Validate that attendee exists
        const attendee = await user_model_1.UsersCollection.findById(attendeeId);
        if (!attendee) {
            res.status(http_status_1.NOT_FOUND).json({
                status: "error",
                message: "Attendee not found",
            });
        }
        // Check if attendance already exists for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const existingAttendance = await attendance_model_1.AttendanceCollection.findOne({
            classId,
            attendeeId,
            attendeeAt: {
                $gte: today,
                $lt: tomorrow,
            },
        });
        if (existingAttendance) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "error",
                message: "Attendance already marked for today",
            });
        }
        // Create new attendance record
        const newAttendance = new attendance_model_1.AttendanceCollection({
            classId,
            attendeeId,
            attenderId,
            status,
            attendeeAt: new Date(),
        });
        const savedAttendance = await newAttendance.save();
        res.status(http_status_1.CREATED).json({
            status: "success",
            message: "Attendance created successfully",
            data: { attendance: savedAttendance },
        });
    }
    catch (error) {
        console.error("Error in createClassAttendance:", error);
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
exports.createClassAttendance = createClassAttendance;
const updateClassAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, attendeeAt } = req.body;
        // Validate ObjectId format
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "error",
                message: "Invalid attendance ID format",
            });
            return;
        }
        // Validate status if provided
        if (status) {
            const validStatuses = ["present", "absent", "late", "excused"];
            if (!validStatuses.includes(status)) {
                res.status(http_status_1.BAD_REQUEST).json({
                    status: "error",
                    message: "Status must be one of: present, absent, late, excused",
                });
                return;
            }
        }
        // Build update object with only provided fields
        const updateData = {};
        if (status)
            updateData.status = status;
        if (attendeeAt)
            updateData.attendeeAt = new Date(attendeeAt);
        if (Object.keys(updateData).length === 0) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "error",
                message: "No valid fields provided for update",
            });
            return;
        }
        // Find and update attendance record
        const updatedAttendance = await attendance_model_1.AttendanceCollection.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .populate({
            path: "attendeeId",
            model: "Users",
            select: "email role createdAt updatedAt",
        })
            .populate({
            path: "attenderId",
            model: "Users",
            select: "email role createdAt updatedAt",
        });
        if (!updatedAttendance) {
            res.status(http_status_1.NOT_FOUND).json({
                status: "error",
                message: "Attendance record not found",
            });
            return;
        }
        res.status(http_status_1.OK).json({
            status: "success",
            message: "Attendance updated successfully",
            data: { attendance: updatedAttendance },
        });
    }
    catch (error) {
        console.error("Error in updateClassAttendance:", error);
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
exports.updateClassAttendance = updateClassAttendance;
const deleteClassAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ObjectId format
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "error",
                message: "Invalid attendance ID format",
            });
            return;
        }
        // Find and delete attendance record
        const deletedAttendance = await attendance_model_1.AttendanceCollection.findByIdAndDelete(id);
        if (!deletedAttendance) {
            res.status(http_status_1.NOT_FOUND).json({
                status: "error",
                message: "Attendance record not found",
            });
            return;
        }
        res.status(http_status_1.OK).json({
            status: "success",
            message: "Attendance deleted successfully",
            data: {
                deletedId: id,
                deletedAttendance: {
                    id: deletedAttendance._id,
                    classId: deletedAttendance.classId,
                    attendeeId: deletedAttendance.attendeeId,
                    attenderId: deletedAttendance.attenderId,
                    status: deletedAttendance.status,
                    attendeeAt: deletedAttendance.attendeeAt,
                },
            },
        });
    }
    catch (error) {
        console.error("Error in deleteClassAttendance:", error);
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
exports.deleteClassAttendance = deleteClassAttendance;
