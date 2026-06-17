const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for logged-in user (optional project filter)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const filter = { ownerId: req.user.id };
    if (req.query.projectId) {
      filter.projectId = req.query.projectId;
    }
    const tasks = await Task.find(filter).populate('projectId');
    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  const { title, description, status, priority, dueDate, projectId } = req.body;

  if (!title || !projectId) {
    const error = new Error('Please add title and projectId');
    error.statusCode = 400;
    return next(error);
  }

  try {
    // Verify referenced project exists and belongs to the user
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      return next(error);
    }
    if (project.ownerId.toString() !== req.user.id) {
      const error = new Error('Not authorized to add tasks to this project');
      error.statusCode = 403;
      return next(error);
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
    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('projectId');
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (task.ownerId.toString() !== req.user.id) {
      const error = new Error('Not authorized to access this task');
      error.statusCode = 403;
      return next(error);
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (task.ownerId.toString() !== req.user.id) {
      const error = new Error('Not authorized to access this task');
      error.statusCode = 403;
      return next(error);
    }

    // If updating projectId, verify ownership of the new project too
    if (req.body.projectId && req.body.projectId !== task.projectId.toString()) {
      const project = await Project.findById(req.body.projectId);
      if (!project) {
        const error = new Error('New project not found');
        error.statusCode = 404;
        return next(error);
      }
      if (project.ownerId.toString() !== req.user.id) {
        const error = new Error('Not authorized to assign tasks to this project');
        error.statusCode = 403;
        return next(error);
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('projectId');

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (task.ownerId.toString() !== req.user.id) {
      const error = new Error('Not authorized to access this task');
      error.statusCode = 403;
      return next(error);
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      data: { message: 'Task removed' },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
};
