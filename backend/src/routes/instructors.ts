import { Router } from 'express';
import { authenticateInstructor } from '../middleware/instructor';
import { addCourses, courseReviewSubmit, getDashboard } from '../controllers/instructor';

const router = Router();


router.get('/dashboard', authenticateInstructor, getDashboard);
router.post('/addcourses', authenticateInstructor, addCourses);
router.put('/requestreview', authenticateInstructor, courseReviewSubmit);

export default router;