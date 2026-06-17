const Project = require('../models/Project');

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ ownerId: req.user.id }).populate('clientId');
    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  const { title, description, status, deadline, clientId } = req.body;

  if (!title || !clientId) {
    const error = new Error('Please add title and clientId');
    error.statusCode = 400;
    return next(error);
  }

  try {
    const project = await Project.create({
      ownerId: req.user.id,
      clientId,
      title,
      description,
      status: status || 'Planning',
      deadline,
    });
    
    // Populate clientId info before returning
    const populatedProject = await Project.findById(project._id).populate('clientId');
    res.status(201).json({
      success: true,
      data: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('clientId');
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (project.ownerId.toString() !== req.user.id) {
      const error = new Error('Not authorized to access this project');
      error.statusCode = 403;
      return next(error);
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (project.ownerId.toString() !== req.user.id) {
      const error = new Error('Not authorized to access this project');
      error.statusCode = 403;
      return next(error);
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('clientId');

    res.json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (project.ownerId.toString() !== req.user.id) {
      const error = new Error('Not authorized to access this project');
      error.statusCode = 403;
      return next(error);
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      data: { message: 'Project removed' },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
