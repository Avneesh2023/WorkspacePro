const Client = require('../models/Client');

// @desc    Get all clients for logged-in user
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ ownerId: req.user.id });
    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private
const createClient = async (req, res, next) => {
  const { name, email, phone, company, notes } = req.body;

  try {
    const client = await Client.create({
      ownerId: req.user.id,
      name,
      email,
      phone,
      company,
      notes,
    });
    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single client by ID
// @route   GET /api/clients/:id
// @access  Private
const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      const error = new Error('Client not found');
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (client.ownerId.toString() !== req.user.id) {
      const error = new Error('Not authorized to access this client');
      error.statusCode = 403;
      return next(error);
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      const error = new Error('Client not found');
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (client.ownerId.toString() !== req.user.id) {
      const error = new Error('Not authorized to access this client');
      error.statusCode = 403;
      return next(error);
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({
      success: true,
      data: updatedClient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      const error = new Error('Client not found');
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (client.ownerId.toString() !== req.user.id) {
      const error = new Error('Not authorized to access this client');
      error.statusCode = 403;
      return next(error);
    }

    await Client.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      data: { message: 'Client removed' },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
};
