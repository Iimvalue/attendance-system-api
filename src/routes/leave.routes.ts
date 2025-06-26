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
import { authorized, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authorized, restrictTo('admin', 'principle'), getAllLeaves);

router.post('/', authorized, restrictTo('admin','student'), createLeave);

router.get('/student/:studentId', authorized, restrictTo('admin', 'principle', 'student'), getLeavesByStudentId);

router.get('/class/:classId', authorized, restrictTo('admin', 'principle'), getLeavesByClassId);

router.delete('/:leaveId', authorized, restrictTo('admin', 'principle', 'student'), deleteLeave);

router.post('/:leaveId/accept', authorized, restrictTo('admin', 'principle'), acceptLeave);

router.post('/:leaveId/reject', authorized, restrictTo('admin', 'principle', ), rejectLeave);

export default router;
