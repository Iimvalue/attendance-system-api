"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLeave = exports.rejectLeave = exports.acceptLeave = exports.getLeavesByUser = exports.getLeavesByClass = exports.getAllLeaves = exports.createLeave = void 0;
const leave_model_1 = require("../models/leave.model");
const createLeave = async (leaveData) => {
    const leave = await leave_model_1.Leave.create(leaveData);
    return leave;
};
exports.createLeave = createLeave;
const getAllLeaves = async () => {
    const leaves = await leave_model_1.Leave.find()
        .populate('studentId', 'email role')
        .populate('classId', 'name')
        .populate('acceptedBy', 'email role')
        .populate('rejectedBy', 'email role');
    return leaves;
};
exports.getAllLeaves = getAllLeaves;
const getLeavesByClass = async (classId) => {
    const leaves = await leave_model_1.Leave.find({ classId })
        .populate('studentId', 'email role')
        .populate('classId', 'name')
        .populate('acceptedBy', 'email role')
        .populate('rejectedBy', 'email role');
    return leaves;
};
exports.getLeavesByClass = getLeavesByClass;
const getLeavesByUser = async (userId) => {
    const leaves = await leave_model_1.Leave.find({ studentId: userId }).populate('classId').populate('acceptedBy', 'email role').populate('rejectedBy', 'email role');
    return leaves;
};
exports.getLeavesByUser = getLeavesByUser;
const acceptLeave = async (leaveId, userId) => {
    const existingLeave = await leave_model_1.Leave.findById(leaveId);
    if (!existingLeave) {
        throw new Error('Leave not found');
    }
    if (existingLeave.acceptedBy || existingLeave.rejectedBy) {
        throw new Error('Leave has already been processed');
    }
    const leave = await leave_model_1.Leave.findByIdAndUpdate(leaveId, {
        acceptedBy: userId,
        acceptedAt: new Date(),
    }, { new: true })
        .populate('classId', 'name')
        .populate('studentId', 'email role')
        .populate('acceptedBy', 'email role')
        .populate('rejectedBy', 'email role');
    return leave;
};
exports.acceptLeave = acceptLeave;
const rejectLeave = async (leaveId, userId) => {
    const existingLeave = await leave_model_1.Leave.findById(leaveId);
    if (!existingLeave) {
        throw new Error('Leave not found');
    }
    if (existingLeave.acceptedBy || existingLeave.rejectedBy) {
        throw new Error('Leave has already been processed');
    }
    const leave = await leave_model_1.Leave.findByIdAndUpdate(leaveId, {
        rejectedBy: userId,
        rejectedAt: new Date(),
    }, { new: true })
        .populate('classId', 'name')
        .populate('studentId', 'email role')
        .populate('acceptedBy', 'email role')
        .populate('rejectedBy', 'email role');
    return leave;
};
exports.rejectLeave = rejectLeave;
const deleteLeave = async (leaveId) => {
    const leave = await leave_model_1.Leave.findByIdAndDelete(leaveId)
        .populate('classId', 'name')
        .populate('studentId', 'email role')
        .populate('acceptedBy', 'email role')
        .populate('rejectedBy', 'email role');
    return leave;
};
exports.deleteLeave = deleteLeave;
