import express from 'express';
import { getOverviewMetrics, getStatusDistribution, getProductivityTrend, getEmployeeWorkload } from '../controllers/analyticsController.js';
import { protect, managerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/overview', protect, getOverviewMetrics);
router.get('/distribution', protect, getStatusDistribution);
router.get('/trend', protect, getProductivityTrend);
router.get('/workload', protect, managerOrAdmin, getEmployeeWorkload);

export default router;
