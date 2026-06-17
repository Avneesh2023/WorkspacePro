const express = require('express');
const router = express.Router();
const {
  getClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

const { clientValidationRules } = require('../middleware/validationMiddleware');

// Protect all client routes
router.use(protect);

router.route('/')
  .get(getClients)
  .post(clientValidationRules, createClient);

router.route('/:id')
  .get(getClientById)
  .put(clientValidationRules, updateClient)
  .delete(deleteClient);

module.exports = router;
