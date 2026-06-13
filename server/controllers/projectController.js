const Project = require('../models/Project');

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ ownerId: req.user.id }).populate('clientId');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  const { title, description, status, deadline, clientId } = req.body;

  if (!title || !clientId) {
    return res.status(400).json({ message: 'Please add title and clientId' });
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
    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('clientId');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify ownership
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify ownership
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('clientId');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify ownership
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
