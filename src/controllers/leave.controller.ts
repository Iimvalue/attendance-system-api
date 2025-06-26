import { AuthRequest } from "../middleware/auth.middleware"
import { Response } from "express"
import * as leaveService from "../services/leave.service"

export const createLeave = async (req: AuthRequest, res: Response) => {
  try {
    const leaveData = req.body
    leaveData.studentId = req.user._id 
    const leave = await leaveService.createLeave(leaveData)
    res.status(201).json(leave)
  } catch (error) {
    console.error("Error creating leave:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getAllLeaves = async (req: AuthRequest, res: Response) => {
  try {
    const leaves = await leaveService.getAllLeaves()
    res.status(200).json(leaves)
  } catch (error) {
    console.error("Error fetching leaves:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
export const getLeavesByStudentId = async (req: AuthRequest, res: Response) => {
  try {

    const studentId = req.params.studentId
    const leaves = await leaveService.getLeavesByUser(studentId)
    res.status(200).json(leaves)
  } catch (error) {
    console.error("Error fetching leaves by student ID:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
export const getLeavesByClassId = async (req: AuthRequest, res: Response) => {
  try {

    const classId = req.params.classId
    const leaves = await leaveService.getLeavesByClass(classId)
    res.status(200).json(leaves)
  } catch (error) {
    console.error("Error fetching leaves by class ID:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
export const deleteLeave = async (req: AuthRequest, res: Response) => {
  try {
    const leaveId = req.params.leaveId
    const leave = await leaveService.deleteLeave(leaveId)
    if (!leave) {
      res.status(404).json({ message: "Leave not found" })
      return
    }
    res.status(200).json({ message: "Leave deleted successfully", leave })
  } catch (error) {
    console.error("Error deleting leave:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
export const acceptLeave = async (req: AuthRequest, res: Response) => {
  try {
    const leaveId = req.params.leaveId
    const userId = req.user._id
    const leave = await leaveService.acceptLeave(leaveId, userId)
    if (!leave) {
      res.status(404).json({ message: "Leave not found" })
      return
    }
    res.status(200).json({ message: "Leave accepted successfully", leave })
  } catch (error: any) {
    console.error("Error accepting leave:", error)
    if (error.message === 'Leave not found') {
      res.status(404).json({ message: error.message })
    } else if (error.message === 'Leave has already been processed') {
      res.status(400).json({ message: error.message })
    } else {
      res.status(500).json({ message: "Internal server error" })
    }
  }
}
export const rejectLeave = async (req: AuthRequest, res: Response) => {
  try {
    const leaveId = req.params.leaveId
    const userId = req.user._id
    const leave = await leaveService.rejectLeave(leaveId, userId)
    if (!leave) {
      res.status(404).json({ message: "Leave not found" })
      return
    }
    res.status(200).json({ message: "Leave rejected successfully", leave })
  } catch (error: any) {
    console.error("Error rejecting leave:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

