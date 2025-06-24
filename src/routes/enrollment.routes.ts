import { Router } from 'express';
import * as EnrollmentController from '../controllers/enrollment.controller';

const router = Router();

router.post('/', EnrollmentController.createEnrollment);

router.get('/', EnrollmentController.getAllEnrollments);

// teacher's view of all their students
router.get('/teacher/:teacherId/students', EnrollmentController.getStudentsByTeacher);

// students in a specific class
router.get('/class/:classId', EnrollmentController.getEnrollmentsByClass);

// student sees classes they are enrolled in
router.get('/user/:userId', EnrollmentController.getEnrollmentsByUser);

router.get('/:id', EnrollmentController.getEnrollmentById);

router.put('/:id', EnrollmentController.updateEnrollment);

router.delete('/:id', EnrollmentController.deleteEnrollment);

export default router;