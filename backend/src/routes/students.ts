import { Router } from 'express';
import { authenticateStudent } from '../middleware/student';
import {
    enrollCourse,
    getCourseDetails,
    getEnrollmentProgress,
    getLastViewed,
    getMyAttempts,
    getMyCertificates,
    getMyEnrollments,
    getMyProgress,
    getPublishedCourses,
    startQuiz, 
    submitQuiz, 
    updateLessonProgress
} from '../controllers/student';


const router = Router();
router.use(authenticateStudent);

router.get('/courses', getPublishedCourses);
router.get('/courses/:id', getCourseDetails);
router.post('/enroll/:courseId', enrollCourse);

router.get('/my/enrollments', getMyEnrollments);
router.get('/my/progress', getMyProgress);
router.get('/my/progress/:courseId', getEnrollmentProgress);
router.post('/my/progress/lesson', updateLessonProgress);
router.get('/my/last-viewed', getLastViewed);

router.post('/quiz/:quizId/start', startQuiz);
router.post('/quiz/attempt/:attemptId/submit', submitQuiz);
router.get('/my/attempts', getMyAttempts);

router.get('/my/certificates', getMyCertificates);

export default router;