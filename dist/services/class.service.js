"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassCapacity = exports.deleteClass = exports.updateClass = exports.createClass = exports.getClassById = exports.getClassAll = void 0;
const class_model_1 = require("../models/class.model");
// create a new class
const createClass = async (classData) => {
    const newClass = await class_model_1.ClassCollection.create(classData);
    return newClass;
};
exports.createClass = createClass;
// get all classes
const getClassAll = async () => {
    const classList = await class_model_1.ClassCollection.find();
    if (!classList || classList.length === 0) {
        throw new Error("No classes found");
    }
    return classList;
};
exports.getClassAll = getClassAll;
// get class by id
const getClassById = async (id) => {
    const oneClass = await class_model_1.ClassCollection.findById(id);
    if (!oneClass) {
        throw new Error(`Class with id not found`);
    }
    return oneClass;
};
exports.getClassById = getClassById;
// update class by id
const updateClass = async (id, classData) => {
    const updatedClass = await class_model_1.ClassCollection.findByIdAndUpdate(id, classData, {
        new: true,
    });
    if (!updatedClass) {
        throw new Error(`Class with id not found`);
    }
    return updatedClass;
};
exports.updateClass = updateClass;
// delete class by id
const deleteClass = async (id) => {
    return await class_model_1.ClassCollection.findByIdAndDelete(id);
};
exports.deleteClass = deleteClass;
// get class capacity by id
const getClassCapacity = async (id) => {
    const oneClass = await class_model_1.ClassCollection.findById(id);
    return oneClass?.capacity || 0;
};
exports.getClassCapacity = getClassCapacity;
