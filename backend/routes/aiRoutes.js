import express from 'express';
import { breakdownTask, summarizeTask, suggestPriority, improveDescription } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/breakdown', protect, breakdownTask);
router.post('/summarize', protect, summarizeTask);
router.post('/suggest-priority', protect, suggestPriority);
router.post('/improve-description', protect, improveDescription);

export default router;
