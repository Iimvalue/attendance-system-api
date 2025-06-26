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
const express_1 = require("express");
const EnrollmentController = __importStar(require("../controllers/enrollment.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authorized, (0, auth_middleware_1.restrictTo)('admin', 'principle'), EnrollmentController.createEnrollment);
router.get('/', auth_middleware_1.authorized, (0, auth_middleware_1.restrictTo)('admin', 'principle'), EnrollmentController.getAllEnrollments);
router.get('/teacher/:teacherId/students', auth_middleware_1.authorized, (0, auth_middleware_1.restrictTo)('admin', 'principle', 'teacher'), EnrollmentController.getStudentsByTeacher);
router.get('/class/:classId', auth_middleware_1.authorized, (0, auth_middleware_1.restrictTo)('admin', 'principle', 'teacher', 'student'), EnrollmentController.getEnrollmentsByClass);
router.get('/user/:userId', auth_middleware_1.authorized, (0, auth_middleware_1.restrictTo)('admin', 'principle', 'teacher', 'student'), EnrollmentController.getEnrollmentsByUser);
router.get('/:id', auth_middleware_1.authorized, (0, auth_middleware_1.restrictTo)('admin', 'principle', 'teacher', 'student'), EnrollmentController.getEnrollmentById);
router.put('/:id', auth_middleware_1.authorized, (0, auth_middleware_1.restrictTo)('admin', 'principle'), EnrollmentController.updateEnrollment);
router.delete('/:id', auth_middleware_1.authorized, (0, auth_middleware_1.restrictTo)('admin'), EnrollmentController.deleteEnrollment);
exports.default = router;
