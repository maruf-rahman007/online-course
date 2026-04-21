import { Router } from 'express';
import { authenticateInstructor } from '../middleware/instructor';
import {
    addCourses,
    addLesson,
    courseReviewSubmit,
    editCourse,
    getDashboard,
    addQuiz,
    addQuestion,
    getQuizzesByCourse,
    deleteQuiz,
    deleteOwnCourse,
    getEnrolledStudents,
    getStudentPerformance,
    getAllStudentsAllCourses

} from '../controllers/instructor';

const router = Router();

router.use(authenticateInstructor);
router.get('/dashboard', getDashboard);
router.post('/addcourses', addCourses);
router.put('/requestreview', courseReviewSubmit);
router.post('/addlesson', addLesson);
router.put('/editcourse/:id', editCourse);
router.post('/quiz', addQuiz);
router.post('/quiz/question', addQuestion);
router.get('/quiz/:courseId', getQuizzesByCourse);
router.delete('/quiz/:quizId', deleteQuiz);
router.delete('/course/:courseId', deleteOwnCourse);
router.get('/students', getAllStudentsAllCourses);
router.get('/students/:courseId', getEnrolledStudents);
router.get('/students/:courseId/performance/:studentId', getStudentPerformance);
export default router;