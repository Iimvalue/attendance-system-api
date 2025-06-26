"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassesByTeacher = exports.deleteClass = exports.updateClass = exports.getClassById = exports.getAllClasses = exports.createClass = void 0;
const class_model_1 = require("../models/class.model");
const http_status_1 = require("../utils/http-status");
const createClass = async (req, res) => {
    try {
        const { name, userId, description, location, capacity, dateStartAt, dateEndAt, timeStartAt, timeEndAt, } = req.body;
        // the descritpion is unnecessary to be in condition because it's not important
        if (!name ||
            !userId ||
            !location ||
            !capacity ||
            !dateStartAt ||
            !dateEndAt ||
            timeStartAt === undefined ||
            timeEndAt === undefined) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "fail",
                message: "All fields are required",
            });
            return;
        }
        if (new Date(dateStartAt) >= new Date(dateEndAt)) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "fail",
                message: "End date must be after start date",
            });
            return;
        }
        if (timeStartAt >= timeEndAt) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "fail",
                message: "End time must be after start time",
            });
            return;
        }
        const newClass = await class_model_1.ClassCollection.create({
            name,
            userId,
            description,
            location,
            capacity,
            dateStartAt: new Date(dateStartAt),
            dateEndAt: new Date(dateEndAt),
            timeStartAt,
            timeEndAt,
        });
        res.status(http_status_1.CREATED).json({
            status: "success",
            message: "Class created successfully",
            data: { class: newClass },
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
exports.createClass = createClass;
const getAllClasses = async (req, res) => {
    try {
        const classes = await class_model_1.ClassCollection.find().sort({ createdAt: -1 });
        const total = await class_model_1.ClassCollection.countDocuments();
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
exports.getAllClasses = getAllClasses;
const getClassById = async (req, res) => {
    try {
        const { id } = req.params;
        const classData = await class_model_1.ClassCollection.findById(id);
        if (!classData) {
            res.status(http_status_1.NOT_FOUND).json({
                status: "fail",
                message: "Class not found",
            });
            return;
        }
        res.status(http_status_1.OK).json({
            status: "success",
            data: { class: classData },
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
exports.getClassById = getClassById;
const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedClass = await class_model_1.ClassCollection.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedClass) {
            res.status(http_status_1.NOT_FOUND).json({
                status: "fail",
                message: "Class not found",
            });
            return;
        }
        res.status(http_status_1.OK).json({
            status: "success",
            message: "Class updated successfully",
            data: { class: updatedClass },
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
exports.updateClass = updateClass;
const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClass = await class_model_1.ClassCollection.findByIdAndDelete(id);
        if (!deletedClass) {
            res.status(http_status_1.NOT_FOUND).json({
                status: "fail",
                message: "Class not found",
            });
            return;
        }
        res.status(http_status_1.OK).json({
            status: "success",
            message: "Class deleted successfully",
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
exports.deleteClass = deleteClass;
const getClassesByTeacher = async (req, res) => {
    try {
        const { userId } = req.params;
        const classes = await class_model_1.ClassCollection.find({ userId }).sort({
            createdAt: -1,
        });
        res.status(http_status_1.OK).json({
            status: "success",
            data: { classes },
        });
    }
    catch (error) {
        res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Internal server error",
        });
    }
};
exports.getClassesByTeacher = getClassesByTeacher;
