import { Router } from 'express';
import { getDashboard, reviewStatus } from '../controllers/admin';
import { authenticateAdmin } from '../middleware/admin';

const router = Router();

router.post('/status/:id/:action', authenticateAdmin, reviewStatus);
router.get('/dashboard', authenticateAdmin, getDashboard);

export default router;