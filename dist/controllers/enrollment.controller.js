"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentsByTeacher = exports.getEnrollmentsByUser = exports.getEnrollmentsByClass = exports.deleteEnrollment = exports.updateEnrollment = exports.getEnrollmentById = exports.getAllEnrollments = exports.createEnrollment = void 0;
const enrollment_model_1 = require("../models/enrollment.model");
const http_status_1 = require("../utils/http-status");
const createEnrollment = async (req, res) => {
    try {
        const { classId, userId } = req.body;
        if (!classId || !userId) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "fail",
                message: "All fields are required",
            });
            return;
        }
        const newEnrollment = await enrollment_model_1.EnrollmentCollection.create({
            classId,
            userId,
        });
        res.status(http_status_1.CREATED).json({
            status: "success",
            message: "Enrollment created successfully",
            data: { enrollment: newEnrollment },
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
exports.createEnrollment = createEnrollment;
const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await enrollment_model_1.EnrollmentCollection.find().sort({
            createdAt: -1,
        });
        const total = await enrollment_model_1.EnrollmentCollection.countDocuments();
        res.status(http_status_1.OK).json({
            status: "success",
            data: { enrollments, total },
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "internal server error",
        });
    }
};
exports.getAllEnrollments = getAllEnrollments;
const getEnrollmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const enrollmentData = await enrollment_model_1.EnrollmentCollection.findById(id);
        if (!enrollmentData) {
            res.status(http_status_1.NOT_FOUND).json({
                status: "fail",
                message: "Enrollment not found",
            });
            return;
        }
        res.status(http_status_1.OK).json({
            status: "success",
            data: { enrollment: enrollmentData },
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "internal server error",
        });
    }
};
exports.getEnrollmentById = getEnrollmentById;
const updateEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedEnrollment = await enrollment_model_1.EnrollmentCollection.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedEnrollment) {
            res.status(http_status_1.NOT_FOUND).json({
                status: "fail",
                message: "Enrollment not found",
            });
            return;
        }
        res.status(http_status_1.OK).json({
            status: "success",
            message: "enrollment updated successfully",
            data: { enrollment: updatedEnrollment },
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "internal server error",
        });
    }
};
exports.updateEnrollment = updateEnrollment;
const deleteEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEnrollment = await enrollment_model_1.EnrollmentCollection.findByIdAndDelete(id);
        if (!deletedEnrollment) {
            res.status(http_status_1.NOT_FOUND).json({
                status: "fail",
                message: "Enrollment not found",
            });
            return;
        }
        res.status(http_status_1.OK).json({
            status: "success",
            message: "enrollment deleted successfully",
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "internal server error",
        });
    }
};
exports.deleteEnrollment = deleteEnrollment;
const getEnrollmentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const enrollments = await enrollment_model_1.EnrollmentCollection.find({ classId })
            .populate("userId") // later select relevant fields!!! Note to self
            .sort({ createdAt: -1 });
        res.status(http_status_1.OK).json({
            status: "success",
            data: { enrollments },
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
exports.getEnrollmentsByClass = getEnrollmentsByClass;
const getEnrollmentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const enrollments = await enrollment_model_1.EnrollmentCollection.find({ userId })
            .populate("classId", "name description location")
            .sort({ createdAt: -1 });
        res.status(http_status_1.OK).json({
            status: "success",
            data: { enrollments },
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
exports.getEnrollmentsByUser = getEnrollmentsByUser;
const getStudentsByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { ClassCollection } = await Promise.resolve().then(() => __importStar(require("../models/class.model")));
        const teacherClasses = await ClassCollection.find({ userId: teacherId });
        if (teacherClasses.length === 0) {
            res.status(http_status_1.OK).json({
                status: "success",
                data: { students: [] },
            });
            return;
        }
        const classIds = teacherClasses.map((cls) => cls._id);
        const enrollments = await enrollment_model_1.EnrollmentCollection.find({
            classId: { $in: classIds },
        })
            .populate("userId") // note to self : later select relevant fields!!!
            .populate("classId", "name");
        res.status(http_status_1.OK).json({
            status: "success",
            data: { students: enrollments },
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
exports.getStudentsByTeacher = getStudentsByTeacher;
