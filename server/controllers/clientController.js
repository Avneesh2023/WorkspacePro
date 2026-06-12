const Client = require('../models/Client');

// @desc    Get all clients for logged-in user
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ ownerId: req.user.id });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private
const createClient = async (req, res) => {
  const { name, email, phone, company, notes } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Please add name and email' });
  }

  try {
    const client = await Client.create({
      ownerId: req.user.id,
      name,
      email,
      phone,
      company,
      notes,
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(550).json({ message: error.message });
  }
};

// @desc    Get single client by ID
// @route   GET /api/clients/:id
// @access  Private
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Verify ownership
    if (client.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this client' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Verify ownership
    if (client.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this client' });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Verify ownership
    if (client.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this client' });
    }

    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
};
