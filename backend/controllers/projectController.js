import Project from '../models/Project.js';
import { logActivity } from '../utils/activityLogger.js';

// @desc    Get all projects (for dropdowns and lists)
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).populate('owner', 'firstName lastName').populate('members', 'firstName lastName');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Manager/Admin)
export const createProject = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const project = await Project.create({
            name,
            description,
            status: status || 'Active',
            owner: req.user._id,
            members: [req.user._id]
        });

        await logActivity(req.user._id, 'created project', 'Project', project._id, project.name);

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Manager/Admin)
export const updateProject = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.name = name || project.name;
        project.description = description || project.description;
        project.status = status || project.status;

        const updatedProject = await project.save();
        
        await logActivity(req.user._id, 'updated project', 'Project', project._id, project.name);

        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await project.deleteOne();
        
        await logActivity(req.user._id, 'deleted project', 'Project', null, project.name);

        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
