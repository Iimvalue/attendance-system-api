import { ClassCollection } from "../models/class.model"
import { ClassDocument } from "../models/class.model"

const createClass = async (classData: ClassDocument) => {
  const newClass = await ClassCollection.create(classData)
  return newClass
}
const getClassAll = async () => {
  const classList = await ClassCollection.find().populate('userId', 'email role')
  return classList
}
const getClassById = async (id: string) => {
  const oneClass = await ClassCollection.findById(id).populate('userId', 'email role')
  if (!oneClass) {
    throw new Error(`Class with id ${id} not found`)
  }
  return oneClass
}

const updateClass = async (id: string, classData: Partial<ClassDocument>) => {
  const updatedClass = await ClassCollection.findByIdAndUpdate(id, classData, {
    new: true,
    runValidators: true
  }).populate('userId', 'email role')
  if (!updatedClass) {
    throw new Error(`Class with this id is not found`)
  }
  return updatedClass
}
const deleteClass = async (id: string) => {
  const deletedClass = await ClassCollection.findByIdAndDelete(id)
  if (!deletedClass) {
    throw new Error(`Class with this id is not found`)
  }
  return deletedClass
}

const getClassCapacity = async (id: string) => {
  const oneClass = await ClassCollection.findById(id)
  return oneClass?.capacity || 0
}

export {
  getClassAll,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassCapacity,
}
