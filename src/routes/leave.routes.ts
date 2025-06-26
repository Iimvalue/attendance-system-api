import { 
  getAllLeaves, 
  createLeave, 
  getLeavesByStudentId, 
  getLeavesByClassId, 
  deleteLeave, 
  acceptLeave, 
  rejectLeave 
} from '../controllers/leave.controller';
import { Router } from 'express';
import { authorized } from '../middleware/auth.middleware';

const router = Router();
//  to get all leaves
router.get('/', authorized, getAllLeaves);
//  to create a leave
router.post('/', authorized, createLeave);
//  to get a leave by student ID 
router.get('/student/:studentId', authorized, getLeavesByStudentId);
//  to get leaves by class ID
router.get('/class/:classId', authorized, getLeavesByClassId);
//  to delete a leave by ID
router.delete('/:leaveId', authorized, deleteLeave);
//  to accept a leave
router.post('/:leaveId/accept', authorized, acceptLeave);
//  to reject a leave
router.post('/:leaveId/reject', authorized, rejectLeave);

export default router;
