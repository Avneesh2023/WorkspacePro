const mongoose = require('mongoose');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get dashboard metrics counters
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [
      totalClients,
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks
    ] = await Promise.all([
      Client.countDocuments({ ownerId }),
      Project.countDocuments({ ownerId }),
      Task.countDocuments({ ownerId }),
      Task.countDocuments({ ownerId, status: 'Completed' }),
      Task.countDocuments({ ownerId, status: { $ne: 'Completed' } })
    ]);

    res.json({
      totalClients,
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ message: 'Server error retrieving dashboard stats' });
  }
};

// @desc    Get recent 5 projects for dashboard
// @route   GET /api/dashboard/recent-projects
// @access  Private
const getRecentProjects = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const recentProjects = await Project.find({ ownerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('clientId', 'name company email');
    res.json(recentProjects);
  } catch (error) {
    console.error('Error in getRecentProjects:', error);
    res.status(500).json({ message: 'Server error retrieving recent projects' });
  }
};

// @desc    Get recent 5 tasks
// @route   GET /api/dashboard/recent-tasks
// @access  Private
const getRecentTasks = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const recentTasks = await Task.find({ ownerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('projectId', 'title');
    res.json(recentTasks);
  } catch (error) {
    console.error('Error in getRecentTasks:', error);
    res.status(500).json({ message: 'Server error retrieving recent tasks' });
  }
};

// @desc    Get project counts grouped by status
// @route   GET /api/dashboard/project-status
// @access  Private
const getProjectStatusStats = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.id);
    
    const stats = await Project.aggregate([
      { $match: { ownerId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const formatted = {
      'Planning': 0,
      'In Progress': 0,
      'Review': 0,
      'Completed': 0
    };
    
    stats.forEach(item => {
      if (item._id in formatted) {
        formatted[item._id] = item.count;
      }
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error in getProjectStatusStats:', error);
    res.status(500).json({ message: 'Server error retrieving project status statistics' });
  }
};

// @desc    Get task counts grouped by status
// @route   GET /api/dashboard/task-status
// @access  Private
const getTaskStatusStats = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.id);

    const stats = await Task.aggregate([
      { $match: { ownerId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const formatted = {
      'Todo': 0,
      'In Progress': 0,
      'Completed': 0
    };

    stats.forEach(item => {
      if (item._id in formatted) {
        formatted[item._id] = item.count;
      }
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error in getTaskStatusStats:', error);
    res.status(500).json({ message: 'Server error retrieving task completion statistics' });
  }
};

module.exports = {
  getDashboardStats,
  getRecentProjects,
  getRecentTasks,
  getProjectStatusStats,
  getTaskStatusStats
};
