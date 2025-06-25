import { Request, Response } from "express"
import { ClassCollection } from "../models/class.model"
import {
  OK,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../utils/http-status"

export const createClass = async (req: Request, res: Response) => {
  try {
    const {
      name,
      userId,
      description,
      location,
      capacity,
      dateStartAt,
      dateEndAt,
      timeStartAt,
      timeEndAt,
    } = req.body

    // the descritpion is unnecessary to be in condition because it's not important
    if (
      !name ||
      !userId ||
      !location ||
      !capacity ||
      !dateStartAt ||
      !dateEndAt ||
      timeStartAt === undefined ||
      timeEndAt === undefined
    ) {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "All fields are required",
      })
      return
    }

    if (new Date(dateStartAt) >= new Date(dateEndAt)) {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "End date must be after start date",
      })
      return
    }

    if (timeStartAt >= timeEndAt) {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "End time must be after start time",
      })
      return
    }

    const newClass = await ClassCollection.create({
      name,
      userId,
      description,
      location,
      capacity,
      dateStartAt: new Date(dateStartAt),
      dateEndAt: new Date(dateEndAt),
      timeStartAt,
      timeEndAt,
    })

    res.status(CREATED).json({
      status: "success",
      message: "Class created successfully",
      data: { class: newClass },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const classes = await ClassCollection.find().sort({ createdAt: -1 })
    const total = await ClassCollection.countDocuments()

    res.status(OK).json({
      status: "success",
      data: { classes, total },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

export const getClassById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const classData = await ClassCollection.findById(id)
    if (!classData) {
      res.status(NOT_FOUND).json({
        status: "fail",
        message: "Class not found",
      })
      return
    }

    res.status(OK).json({
      status: "success",
      data: { class: classData },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

export const updateClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const updatedClass = await ClassCollection.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    if (!updatedClass) {
      res.status(NOT_FOUND).json({
        status: "fail",
        message: "Class not found",
      })
      return
    }

    res.status(OK).json({
      status: "success",
      message: "Class updated successfully",
      data: { class: updatedClass },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deletedClass = await ClassCollection.findByIdAndDelete(id)
    if (!deletedClass) {
      res.status(NOT_FOUND).json({
        status: "fail",
        message: "Class not found",
      })
      return
    }

    res.status(OK).json({
      status: "success",
      message: "Class deleted successfully",
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

export const getClassesByTeacher = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const classes = await ClassCollection.find({ userId }).sort({
      createdAt: -1,
    })

    res.status(OK).json({
      status: "success",
      data: { classes },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
