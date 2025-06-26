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
const ClassController = __importStar(require("../controllers/class.controller"));
const ClassAttendanceController = __importStar(require("../controllers/attendance.controller"));
const router = (0, express_1.Router)();
router.post("/", ClassController.createClass);
router.get("/", ClassController.getAllClasses);
// see the teacher classes
router.get("/teacher/:userId", ClassController.getClassesByTeacher);
router.post("/attendance", ClassAttendanceController.createClassAttendance);
router.get("/attendance", ClassAttendanceController.getAllClassAttendance);
router.get("/attendance/:id", ClassAttendanceController.getClassAttendanceById);
router.put("/attendance/:id", ClassAttendanceController.updateClassAttendance);
router.delete("/attendance/:id", ClassAttendanceController.deleteClassAttendance);
router.get("/:id", ClassController.getClassById);
router.put("/:id", ClassController.updateClass);
router.delete("/:id", ClassController.deleteClass);
router.post("/", ClassController.createClass);
// Attendance Routes
// router.get("/:id/attendance", ClassController.getClassAttendanceById)
// router.put("/:id/attendance", ClassController.updateClassAttendanceById)
// router.delete("/:id/attendance", ClassController.deleteClassAttendanceById)
exports.default = router;
