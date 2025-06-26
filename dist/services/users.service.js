"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTeacherAndStudent = exports.readUser = exports.deleteUser = exports.updateUser = exports.readUsers = exports.createUser = void 0;
const error_1 = require("../utils/error");
const user_model_1 = require("../models/user.model");
const http_status_1 = require("../utils/http-status");
const createUser = async (userData) => {
    const { email, password, role } = userData;
    // Check if user already exists
    const existingUser = await user_model_1.UsersCollection.findOne({ email });
    if (existingUser) {
        throw new error_1.AppError("User with this email already exists", http_status_1.BAD_REQUEST);
    }
    // Create new user
    const newUser = new user_model_1.UsersCollection({
        email,
        password, // Will be hashed automatically by the pre-save middleware
        role,
    });
    // Save the user with better error handling
    try {
        const savedUser = await newUser.save();
        // Return user data (password excluded by transform function)
        return {
            id: savedUser.id,
            email: savedUser.email,
            role: savedUser.role,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt,
        };
    }
    catch (saveError) {
        console.error("Save error details:", saveError);
        // Handle validation errors
        if (saveError.name === "ValidationError") {
            const errors = Object.values(saveError.errors).map((err) => err.message);
            throw new error_1.AppError(`Validation failed: ${errors.join(", ")}`, http_status_1.BAD_REQUEST);
        }
        // Handle duplicate key errors
        if (saveError.code === 11000) {
            throw new error_1.AppError("User with this email already exists", http_status_1.BAD_REQUEST);
        }
        // Re-throw other errors
        throw new error_1.AppError("Failed to create user", 500);
    }
};
exports.createUser = createUser;
const readUsers = async () => {
    const users = await user_model_1.UsersCollection.find();
    return users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }));
};
exports.readUsers = readUsers;
const readTeacherAndStudent = async () => {
    const users = await user_model_1.UsersCollection.find({
        role: { $in: ["teacher", "student"] },
    });
    return users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }));
};
exports.readTeacherAndStudent = readTeacherAndStudent;
const readUser = async (userId) => {
    const user = await user_model_1.UsersCollection.findById(userId);
    if (!user) {
        throw new error_1.AppError("User not found", http_status_1.NOT_FOUND);
    }
    return {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.readUser = readUser;
const updateUser = async (userId, updateData) => {
    const user = await user_model_1.UsersCollection.findById(userId);
    if (!user) {
        throw new error_1.AppError("User not found", http_status_1.NOT_FOUND);
    }
    // Check if email is being updated and if it already exists
    if (updateData.email && updateData.email !== user.email) {
        const existingUser = await user_model_1.UsersCollection.findOne({
            email: updateData.email,
        });
        if (existingUser) {
            throw new error_1.AppError("User with this email already exists", http_status_1.BAD_REQUEST);
        }
    }
    // Update user fields
    if (updateData.email)
        user.email = updateData.email;
    if (updateData.password)
        user.password = updateData.password; // Will be hashed by pre-save middleware
    if (updateData.role)
        user.role = updateData.role;
    // Save the updated user
    const updatedUser = await user.save();
    // Return updated user data
    return {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
    };
};
exports.updateUser = updateUser;
const deleteUser = async (userId) => {
    const user = await user_model_1.UsersCollection.findById(userId);
    if (!user) {
        throw new error_1.AppError("User not found", http_status_1.NOT_FOUND);
    }
    await user_model_1.UsersCollection.findByIdAndDelete(userId);
};
exports.deleteUser = deleteUser;
