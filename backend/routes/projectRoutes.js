import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect, managerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, managerOrAdmin, createProject);

router.route('/:id')
  .put(protect, managerOrAdmin, updateProject)
  .delete(protect, managerOrAdmin, deleteProject);

export default router;
