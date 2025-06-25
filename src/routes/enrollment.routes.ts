import { Router } from 'express';
import { 
  createEnrollment,
  getAllEnrollments,
  getStudentsByTeacher,
  getEnrollmentsByClass,
  getEnrollmentsByUser,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment  
} from '../controllers/enrollment.controller';
import { authorized } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authorized, createEnrollment);

router.get('/', authorized, getAllEnrollments);

// teacher's view of all their students
router.get('/teacher/:teacherId/students', authorized, getStudentsByTeacher);

// students in a specific class
router.get('/class/:classId', authorized, getEnrollmentsByClass);

// student sees classes they are enrolled in
router.get('/user/:userId', authorized, getEnrollmentsByUser);

router.get('/:id', authorized, getEnrollmentById);

router.put('/:id', authorized, updateEnrollment);

router.delete('/:id', authorized, deleteEnrollment);


export default router;