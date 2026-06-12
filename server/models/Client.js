const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client must have an owner ID'],
    },
    name: {
      type: String,
      required: [true, 'Please add a client name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add a client email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Client', clientSchema);
