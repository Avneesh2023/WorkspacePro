const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'File must have an owner ID'],
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'File must belong to a project'],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'Please add a file name'],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Please add a file URL'],
    },
    cloudinaryId: {
      type: String,
      required: [true, 'Please add a Cloudinary public ID'],
    },
    fileType: {
      type: String,
      required: [true, 'Please specify a file mimetype'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('File', fileSchema);
