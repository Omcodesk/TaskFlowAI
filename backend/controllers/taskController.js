import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import { getIO } from '../socket.js';
import { logActivity } from '../utils/activityLogger.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Manager/Admin)
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, projectId, tags } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo || null,
      priority: priority || 'Medium',
      dueDate,
      projectId: projectId || null,
      tags: tags || [],
      createdBy: req.user._id,
      status: 'Todo',
    });

    // Emit real-time event to everyone in the project/organization
    try {
        const io = getIO();
        io.emit('task created', task);
    } catch (err) {
        console.error('Socket error:', err.message);
    }

    // Log Activity
    await logActivity(req.user._id, 'created task', 'Task', task._id, task.title);

    // Generate Notification if assigned to someone else
    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
        const notification = await Notification.create({
            recipient: task.assignedTo,
            sender: req.user._id,
            type: 'Task_Assigned',
            message: `assigned you a new task: ${task.title}`
        });

        // Emit targeted socket event
        try {
            const io = getIO();
            io.to(task.assignedTo.toString()).emit('new notification', notification);
        } catch (err) {
            console.error('Socket error emitting notification:', err.message);
        }
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    // If admin or manager, fetch all tasks. Otherwise, fetch only tasks assigned to the employee.
    let query = {};
    if (req.user.role === 'Employee') {
      query = { assignedTo: req.user._id };
    }

    const tasks = await Task.find(query)
        .populate('assignedTo', 'firstName lastName email')
        .populate('createdBy', 'firstName lastName')
        .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    if (req.user.role === 'Employee' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status || task.status;
    const updatedTask = await task.save();

    // Emit real-time update
    try {
        const io = getIO();
        io.emit('task updated', updatedTask);
    } catch (err) {
        console.error('Socket error:', err.message);
    }

    // Log Activity
    await logActivity(req.user._id, `moved task to ${status}`, 'Task', updatedTask._id, updatedTask.title);

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to a task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const newComment = {
      user: req.user._id,
      text,
    };

    task.comments.push(newComment);
    await task.save();

    // Re-fetch to populate user
    const updatedTask = await Task.findById(req.params.id).populate('comments.user', 'firstName lastName');

    await logActivity(req.user._id, 'commented on task', 'Task', task._id, task.title);

    // Notify assignee if someone else commented
    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
          recipient: task.assignedTo,
          sender: req.user._id,
          type: 'Mention',
          message: `commented on your task: ${task.title}`
      });

      try {
          const io = getIO();
          io.to(task.assignedTo.toString()).emit('new notification', notification);
          // Also broadcast task update to everyone
          io.emit('task updated', updatedTask);
      } catch (err) {}
    } else {
        try {
            const io = getIO();
            io.emit('task updated', updatedTask);
        } catch (err) {}
    }

    res.status(201).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload an attachment to a task
// @route   POST /api/tasks/:id/attachments
// @access  Private
export const addAttachment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Assuming local storage. You would store the URL path.
    const fileUrl = `/uploads/${req.file.filename}`;

    const attachment = {
      filename: req.file.originalname,
      url: fileUrl,
      mimetype: req.file.mimetype,
      uploadedBy: req.user._id,
      uploadedAt: new Date()
    };

    task.attachments = task.attachments || [];
    task.attachments.push(attachment);
    const updatedTask = await task.save();

    await logActivity(req.user._id, 'attached a file to', 'Task', task._id, task.title);

    try {
        const io = getIO();
        io.emit('task updated', updatedTask);
    } catch (err) {}

    res.status(201).json(updatedTask);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, tags, projectId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Enforce RBAC for Admin/Manager
    if (req.user.role === 'Employee') {
        return res.status(403).json({ message: 'Not authorized to edit task details' });
    }

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.priority = priority || task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
    task.tags = tags || task.tags;
    if (projectId !== undefined) task.projectId = projectId;

    const updatedTask = await task.save();
    
    // Populate for frontend
    const populated = await Task.findById(updatedTask._id)
        .populate('assignedTo', 'firstName lastName')
        .populate('projectId', 'name');

    await logActivity(req.user._id, 'updated details of', 'Task', task._id, task.title);

    try {
        const io = getIO();
        io.emit('task updated', populated);
    } catch (err) {}

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
