import express from 'express';
import { getTasks, createTask, updateTaskStatus, addComment, addAttachment, updateTask } from '../controllers/taskController.js';
import { protect, managerOrAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, managerOrAdmin, createTask)
  .get(protect, getTasks);

router.route('/:id')
  .put(protect, managerOrAdmin, updateTask);

router.route('/:id/status').put(protect, updateTaskStatus);

router.route('/:id/comments').post(protect, addComment);

router.route('/:id/attachments').post(protect, upload.single('file'), addAttachment);

export default router;
