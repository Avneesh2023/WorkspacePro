const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const { taskValidationRules } = require('../middleware/validationMiddleware');

// Protect all task routes
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(taskValidationRules, createTask);

router.route('/:id')
  .get(getTaskById)
  .put(taskValidationRules, updateTask)
  .delete(deleteTask);

module.exports = router;
