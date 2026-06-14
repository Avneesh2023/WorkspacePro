const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must have an owner ID'],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Task must belong to a project'],
    },
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Please set a status'],
      enum: {
        values: ['Todo', 'In Progress', 'Completed'],
        message: 'Status must be Todo, In Progress, or Completed'
      },
      default: 'Todo',
    },
    priority: {
      type: String,
      required: [true, 'Please set a priority'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High'
      },
      default: 'Medium',
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing Recommendations:
// 1. ownerId index: Speeds up dashboard/global lists filtering tasks belonging to the authenticated user.
// 2. projectId index: Speeds up lookup operations retrieving tasks under a specific project card/board.
taskSchema.index({ ownerId: 1 });
taskSchema.index({ projectId: 1 });

module.exports = mongoose.model('Task', taskSchema);
