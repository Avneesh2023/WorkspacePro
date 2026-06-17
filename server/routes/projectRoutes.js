const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const { projectValidationRules } = require('../middleware/validationMiddleware');

// Protect all project routes
router.use(protect);

router.route('/')
  .get(getProjects)
  .post(projectValidationRules, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(projectValidationRules, updateProject)
  .delete(deleteProject);

module.exports = router;
