const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRecentProjects,
  getRecentTasks,
  getProjectStatusStats,
  getTaskStatusStats
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// All routes are private/JWT protected
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/recent-projects', getRecentProjects);
router.get('/recent-tasks', getRecentTasks);
router.get('/project-status', getProjectStatusStats);
router.get('/task-status', getTaskStatusStats);

module.exports = router;
