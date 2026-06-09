import express from 'express';
import { getUsers, getPendingUsers, approveUser, rejectUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getUsers);

// Approval routes - protected by protect and admin middleware
router.route('/pending').get(protect, admin, getPendingUsers);
router.route('/:id/approve').put(protect, admin, approveUser);
router.route('/:id/reject').delete(protect, admin, rejectUser);

export default router;
