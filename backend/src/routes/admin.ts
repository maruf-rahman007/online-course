import { Router } from 'express';
import { getDashboard, reviewCourseStatus, reviewUserStatus } from '../controllers/admin';
import { authenticateAdmin } from '../middleware/admin';
import { updateUserInfo } from '../controllers/user';

const router = Router();

router.put('/ustatus/:id/:action', authenticateAdmin, reviewUserStatus);
router.get('/dashboard', authenticateAdmin, getDashboard);
router.post('/updateuser/:id',authenticateAdmin, updateUserInfo);
router.put('/cstatus/:id/:action', authenticateAdmin, reviewCourseStatus);

export default router;