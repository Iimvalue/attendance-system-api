import { Router } from 'express';
import * as EnrollmentController from '../controllers/enrollment.controller';
import { authorized, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authorized, restrictTo('admin', 'principle'), EnrollmentController.createEnrollment);

router.get('/', authorized, restrictTo('admin', 'principle'), EnrollmentController.getAllEnrollments);

router.get('/teacher/:teacherId/students', authorized, restrictTo('admin', 'principle', 'teacher'), EnrollmentController.getStudentsByTeacher);

router.get('/class/:classId', authorized, restrictTo('admin', 'principle', 'teacher', 'student'), EnrollmentController.getEnrollmentsByClass);

router.get('/user/:userId', authorized, restrictTo('admin', 'principle', 'teacher', 'student'), EnrollmentController.getEnrollmentsByUser);

router.get('/:id', authorized, restrictTo('admin', 'principle', 'teacher', 'student'), EnrollmentController.getEnrollmentById);

router.put('/:id', authorized, restrictTo('admin', 'principle'), EnrollmentController.updateEnrollment);

router.delete('/:id', authorized, restrictTo('admin'), EnrollmentController.deleteEnrollment);

export default router;