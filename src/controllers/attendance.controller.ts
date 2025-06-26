import { Request, Response } from "express"
import { AttendanceCollection } from "../models/attendance.model"
import { UsersCollection } from "../models/user.model"
import {
  OK,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../utils/http-status"
import { AuthRequest } from "../middleware/auth.middleware"

const getAllClassAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const attendance = await AttendanceCollection.find()
      .populate({
        path: "attendeeId",
        model: "Users",
        select: "email role createdAt updatedAt",
      })
      .populate({
        path: "attenderId",
        model: "Users",
        select: "email role createdAt updatedAt",
      })
      .populate({
        path: "classId",
        model: "Class",
        select: "name userId description location capacity dateStartAt dateEndAt timeStartAt timeEndAt",
      })
      .sort({ createdAt: -1 })
    
    const total = await AttendanceCollection.countDocuments()
    
    res.status(OK).json({
      status: "success",
      data: { attendance, total },
    })
  } catch (error) {
    console.error("Error in getAllClassAttendance:", error)
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}

const getClassAttendanceById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(BAD_REQUEST).json({
        status: "error",
        message: "Invalid attendance ID format",
      })
    }

    // Find attendance by ID and populate user data
    const attendance = await AttendanceCollection.findById(id)
      .populate({
        path: "attendeeId",
        model: "Users",
        select: "email role createdAt updatedAt",
      })
      .populate({
        path: "attenderId",
        model: "Users",
        select: "email role createdAt updatedAt",
      })
      .populate({
        path: "classId",
        model: "Class",
        select: "name userId description location capacity dateStartAt dateEndAt timeStartAt timeEndAt",
      })

    if (!attendance) {
      res.status(NOT_FOUND).json({
        status: "error",
        message: "Attendance record not found",
      })
    }

    res.status(OK).json({
      status: "success",
      data: { attendance },
    })
  } catch (error) {
    console.error("Error in getClassAttendanceById:", error)
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}
const createClassAttendance = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      classId,
      attendeeId,
      status = "present",
      attenderId: bodyAttenderId,
    } = req.body

    // Use authenticated user's ID as attenderId
    const attenderId = req.user._id || bodyAttenderId

    // Validate required fields
    if (!classId || !attendeeId || !attenderId) {
      res.status(BAD_REQUEST).json({
        status: "error",
        message: "classId, attendeeId, and attenderId are required",
      })
    }

    // Validate status
    const validStatuses = ["present", "absent", "late", "excused"]
    if (!validStatuses.includes(status)) {
      res.status(BAD_REQUEST).json({
        status: "error",
        message: "Status must be one of: present, absent, late, excused",
      })
    }

    // Validate that attendee exists
    const attendee = await UsersCollection.findById(attendeeId)
    if (!attendee) {
      res.status(NOT_FOUND).json({
        status: "error",
        message: "Attendee not found",
      })
    }

    // Check if attendance already exists for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingAttendance = await AttendanceCollection.findOne({
      classId,
      attendeeId,
      attendeeAt: {
        $gte: today,
        $lt: tomorrow,
      },
    })

    if (existingAttendance) {
      res.status(BAD_REQUEST).json({
        status: "error",
        message: "Attendance already marked for today",
      })
    }

    // Create new attendance record
    const newAttendance = new AttendanceCollection({
      classId,
      attendeeId,
      attenderId,
      status,
      attendeeAt: new Date(),
    })

    const savedAttendance = await newAttendance.save()

    res.status(CREATED).json({
      status: "success",
      message: "Attendance created successfully",
      data: { attendance: savedAttendance },
    })
  } catch (error) {
    console.error("Error in createClassAttendance:", error)
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}

const updateClassAttendance = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { status, attendeeAt } = req.body

    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(BAD_REQUEST).json({
        status: "error",
        message: "Invalid attendance ID format",
      })
      return
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ["present", "absent", "late", "excused"]
      if (!validStatuses.includes(status)) {
        res.status(BAD_REQUEST).json({
          status: "error",
          message: "Status must be one of: present, absent, late, excused",
        })
        return
      }
    }

    // Build update object with only provided fields
    const updateData: any = {}
    if (status) updateData.status = status
    if (attendeeAt) updateData.attendeeAt = new Date(attendeeAt)

    if (Object.keys(updateData).length === 0) {
      res.status(BAD_REQUEST).json({
        status: "error",
        message: "No valid fields provided for update",
      })
      return
    }

    // Find and update attendance record
    const updatedAttendance = await AttendanceCollection.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate({
        path: "attendeeId",
        model: "Users",
        select: "email role createdAt updatedAt",
      })
      .populate({
        path: "attenderId",
        model: "Users",
        select: "email role createdAt updatedAt",
      })

    if (!updatedAttendance) {
      res.status(NOT_FOUND).json({
        status: "error",
        message: "Attendance record not found",
      })
      return
    }

    res.status(OK).json({
      status: "success",
      message: "Attendance updated successfully",
      data: { attendance: updatedAttendance },
    })
  } catch (error) {
    console.error("Error in updateClassAttendance:", error)
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}

const deleteClassAttendance = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(BAD_REQUEST).json({
        status: "error",
        message: "Invalid attendance ID format",
      })
      return
    }

    // Find and delete attendance record
    const deletedAttendance = await AttendanceCollection.findByIdAndDelete(id)

    if (!deletedAttendance) {
      res.status(NOT_FOUND).json({
        status: "error",
        message: "Attendance record not found",
      })
      return
    }

    res.status(OK).json({
      status: "success",
      message: "Attendance deleted successfully",
      data: {
        deletedId: id,
        deletedAttendance: {
          id: deletedAttendance._id,
          classId: deletedAttendance.classId,
          attendeeId: deletedAttendance.attendeeId,
          attenderId: deletedAttendance.attenderId,
          status: deletedAttendance.status,
          attendeeAt: deletedAttendance.attendeeAt,
        },
      },
    })
  } catch (error) {
    console.error("Error in deleteClassAttendance:", error)
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}

// const createBulkAttendance = async (req: Request | AuthRequest, res: Response): Promise<Response> => {
//   try {
//     const { classId, attendees, attenderId: bodyAttenderId } = req.body;
//     // attendees should be array of objects: [{ attendeeId: "ObjectId", status?: "present" }]

//     // Check if user is authenticated, otherwise use attenderId from body
//     const attenderId = (req as AuthRequest).user?._id || bodyAttenderId;

//     if (!classId || !attendees || !Array.isArray(attendees) || !attenderId) {
//       return res.status(BAD_REQUEST).json({
//         status: "error",
//         message: "classId, attendees array, and attenderId are required"
//       });
//     }

//     const results = [];
//     const errors = [];

//     for (const attendeeData of attendees) {
//       try {
//         const { attendeeId, status = 'present' } = attendeeData;

//         // Validate status
//         const validStatuses = ['present', 'absent', 'late', 'excused'];
//         if (!validStatuses.includes(status)) {
//           errors.push({ attendeeId, error: 'Invalid status. Must be: present, absent, late, or excused' });
//           continue;
//         }

//         // Validate that attendee exists
//         const attendee = await UsersCollection.findById(attendeeId);
//         if (!attendee) {
//           errors.push({ attendeeId, error: 'Attendee not found' });
//           continue;
//         }

//         // Check for existing attendance
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const tomorrow = new Date(today);
//         tomorrow.setDate(tomorrow.getDate() + 1);

//         const existingAttendance = await AttendanceCollection.findOne({
//           classId,
//           attendeeId,
//           attendeeAt: {
//             $gte: today,
//             $lt: tomorrow
//           }
//         });

//         if (existingAttendance) {
//           errors.push({ attendeeId, error: 'Attendance already marked for today' });
//           continue;
//         }

//         // Create attendance
//         const newAttendance = new AttendanceCollection({
//           classId,
//           attendeeId,
//           attenderId,
//           status,
//           attendeeAt: new Date()
//         });

//         const savedAttendance = await newAttendance.save();
//         results.push(savedAttendance);

//       } catch (error) {
//         errors.push({
//           attendeeId: attendeeData.attendeeId,
//           error: error instanceof Error ? error.message : 'Unknown error'
//         });
//       }
//     }

//     return res.status(CREATED).json({
//       status: "success",
//       message: `${results.length} attendance records created successfully`,
//       data: {
//         created: results,
//         errors: errors,
//         summary: {
//           total: attendees.length,
//           created: results.length,
//           failed: errors.length
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Error in createBulkAttendance:', error);
//     return res.status(INTERNAL_SERVER_ERROR).json({
//       status: "error",
//       message: "Internal server error",
//       error: error instanceof Error ? error.message : 'Unknown error occurred'
//     });
//   }
// };

export {
  getAllClassAttendance,
  createClassAttendance,
  getClassAttendanceById,
  updateClassAttendance,
  deleteClassAttendance,
}
