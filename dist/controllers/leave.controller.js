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
exports.rejectLeave = exports.acceptLeave = exports.deleteLeave = exports.getLeavesByClassId = exports.getLeavesByStudentId = exports.getAllLeaves = exports.createLeave = void 0;
const leaveService = __importStar(require("../services/leave.service"));
const createLeave = async (req, res) => {
    try {
        const leaveData = req.body;
        leaveData.studentId = req.user._id;
        const leave = await leaveService.createLeave(leaveData);
        res.status(201).json(leave);
    }
    catch (error) {
        console.error("Error creating leave:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createLeave = createLeave;
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await leaveService.getAllLeaves();
        res.status(200).json(leaves);
    }
    catch (error) {
        console.error("Error fetching leaves:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllLeaves = getAllLeaves;
const getLeavesByStudentId = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const leaves = await leaveService.getLeavesByUser(studentId);
        res.status(200).json(leaves);
    }
    catch (error) {
        console.error("Error fetching leaves by student ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getLeavesByStudentId = getLeavesByStudentId;
const getLeavesByClassId = async (req, res) => {
    try {
        const classId = req.params.classId;
        const leaves = await leaveService.getLeavesByClass(classId);
        res.status(200).json(leaves);
    }
    catch (error) {
        console.error("Error fetching leaves by class ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getLeavesByClassId = getLeavesByClassId;
const deleteLeave = async (req, res) => {
    try {
        const leaveId = req.params.leaveId;
        const leave = await leaveService.deleteLeave(leaveId);
        if (!leave) {
            res.status(404).json({ message: "Leave not found" });
            return;
        }
        res.status(200).json({ message: "Leave deleted successfully", leave });
    }
    catch (error) {
        console.error("Error deleting leave:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteLeave = deleteLeave;
const acceptLeave = async (req, res) => {
    try {
        const leaveId = req.params.leaveId;
        const userId = req.user._id;
        const leave = await leaveService.acceptLeave(leaveId, userId);
        if (!leave) {
            res.status(404).json({ message: "Leave not found" });
            return;
        }
        res.status(200).json({ message: "Leave accepted successfully", leave });
    }
    catch (error) {
        console.error("Error accepting leave:", error);
        if (error.message === 'Leave not found') {
            res.status(404).json({ message: error.message });
        }
        else if (error.message === 'Leave has already been processed') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
exports.acceptLeave = acceptLeave;
const rejectLeave = async (req, res) => {
    try {
        const leaveId = req.params.leaveId;
        const userId = req.user._id;
        const leave = await leaveService.rejectLeave(leaveId, userId);
        if (!leave) {
            res.status(404).json({ message: "Leave not found" });
            return;
        }
        res.status(200).json({ message: "Leave rejected successfully", leave });
    }
    catch (error) {
        console.error("Error rejecting leave:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.rejectLeave = rejectLeave;
