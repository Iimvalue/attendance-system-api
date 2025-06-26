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
exports.readTeacherAndStudents = exports.deleteUser = exports.updateUser = exports.readUser = exports.readUsers = exports.createUser = void 0;
const http_status_1 = require("../utils/http-status");
const UserService = __importStar(require("../services/users.service"));
const createUser = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        // Check required fields
        if (!email) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "error",
                message: "Email is required",
            });
            return;
        }
        if (!password) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "error",
                message: "Password is required",
            });
            return;
        }
        if (!role) {
            res.status(http_status_1.BAD_REQUEST).json({
                status: "error",
                message: "Role is required",
            });
            return;
        }
        const newUser = await UserService.createUser({
            email,
            password,
            role,
        });
        res.status(http_status_1.CREATED).json({
            status: "success",
            message: "User created successfully",
            data: newUser,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
const readUsers = async (req, res, next) => {
    try {
        const users = await UserService.readUsers();
        res.status(http_status_1.OK).json({
            status: "success",
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.readUsers = readUsers;
const readTeacherAndStudents = async (req, res, next) => {
    try {
        const teacherAndStudent = await UserService.readTeacherAndStudent();
        res.status(http_status_1.OK).json({
            status: "success",
            data: teacherAndStudent,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.readTeacherAndStudents = readTeacherAndStudents;
const readUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await UserService.readUser(userId);
        res.status(http_status_1.OK).json({
            status: "success",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.readUser = readUser;
const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id || req.user._id;
        const { email, password, role } = req.body;
        const updatedUser = await UserService.updateUser(userId, {
            email,
            password,
            role,
        });
        res.status(http_status_1.OK).json({
            status: "success",
            message: "User updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        await UserService.deleteUser(req.user._id);
        res.cookie("accessToken", "none", {
            expires: new Date(Date.now() + 5 * 1000),
            httpOnly: true,
        });
        res.cookie("refreshToken", "none", {
            expires: new Date(Date.now() + 5 * 1000),
            httpOnly: true,
        });
        res.status(http_status_1.OK).json({
            status: "success",
            message: "Account deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
