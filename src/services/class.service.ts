import { ClassCollection } from "../models/class.model"
import { ClassDocument } from "../models/class.model"

// create a new class
const createClass = async (classData: ClassDocument) => {
  const newClass = await ClassCollection.create(classData)
  return newClass
}
// get all classes
const getClassAll = async () => {
  const classList = await ClassCollection.find()
  if (!classList || classList.length === 0) {
    throw new Error("No classes found")
  }
  return classList
}
// get class by id
const getClassById = async (id: string) => {
  const oneClass = await ClassCollection.findById(id)
  if (!oneClass) {
    throw new Error(`Class with id not found`)
  }
  return oneClass
}

// update class by id
const updateClass = async (id: string, classData: ClassDocument) => {
  const updatedClass = await ClassCollection.findByIdAndUpdate(id, classData, {
    new: true,
  })
  if (!updatedClass) {
    throw new Error(`Class with id not found`)
  }
  return updatedClass
}
// delete class by id
const deleteClass = async (id: string) => {
  return await ClassCollection.findByIdAndDelete(id)
}

// get class capacity by id
const getClassCapacity = async (id: string) => {
  const oneClass = await ClassCollection.findById(id)
  return oneClass?.capacity || 0
}

// exporting the service functions
export {
  getClassAll,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassCapacity,
}
