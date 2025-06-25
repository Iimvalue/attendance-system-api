import { Router } from 'express';
import * as ClassController from '../controllers/class.controller';
import { authorized } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authorized, ClassController.createClass);

router.get('/', authorized, ClassController.getAllClasses);
// see the teacher classes
router.get('/teacher/:userId', authorized, ClassController.getClassesByTeacher);

router.get('/:id', authorized, ClassController.getClassById);

router.put('/:id', authorized, ClassController.updateClass);

router.delete('/:id', authorized, ClassController.deleteClass);

export default router;