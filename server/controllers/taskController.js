const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for logged-in user (optional project filter)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const filter = { ownerId: req.user.id };
    if (req.query.projectId) {
      filter.projectId = req.query.projectId;
    }
    const tasks = await Task.find(filter).populate('projectId');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, projectId } = req.body;

  if (!title || !projectId) {
    return res.status(400).json({ message: 'Please add title and projectId' });
  }

  try {
    // Verify referenced project exists and belongs to the user
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add tasks to this project' });
    }

    const task = await Task.create({
      ownerId: req.user.id,
      projectId,
      title,
      description,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate,
    });

    const populatedTask = await Task.findById(task._id).populate('projectId');
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projectId');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify ownership
    if (task.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify ownership
    if (task.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    // If updating projectId, verify ownership of the new project too
    if (req.body.projectId && req.body.projectId !== task.projectId.toString()) {
      const project = await Project.findById(req.body.projectId);
      if (!project) {
        return res.status(404).json({ message: 'New project not found' });
      }
      if (project.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to assign tasks to this project' });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('projectId');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify ownership
    if (task.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
};
