import { Router } from 'express';
import { createCustomRole, deleteCourse, getAllCourses, getDashboard, reviewCourseStatus, reviewUserStatus } from '../controllers/admin';
import { authenticateAdmin } from '../middleware/admin';
import { assignNewRole, getUserInfo, reactivateUser, suspendUser, updateUserInfo } from '../controllers/user';

const router = Router();

router.put('/ustatus/:id/:action', authenticateAdmin, reviewUserStatus);
router.get('/dashboard', authenticateAdmin, getDashboard);
router.post('/updateuser/:id',authenticateAdmin, updateUserInfo);
router.put('/cstatus/:id/:action', authenticateAdmin, reviewCourseStatus);
router.post('/newrole',authenticateAdmin, createCustomRole);
router.put('/suspend/:id',authenticateAdmin, suspendUser);
router.put('/reactivate/:id',authenticateAdmin, reactivateUser);
router.put('/assign/:id/:role',authenticateAdmin, assignNewRole)
router.get('/user/:id',authenticateAdmin,getUserInfo);
router.get('/courses',authenticateAdmin, getAllCourses);
router.delete('/courses/:id',authenticateAdmin, deleteCourse);

export default router;