const mongoose = require("mongoose");

const tasksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    due_date: {
      type: Date,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [{
      type: String,
      trim: true
    }],
    attachments: [{
      filename: String,
      url: String,
      uploaded_at: {
        type: Date,
        default: Date.now
      }
    }],    
    completed_at: {
      type: Date
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", tasksSchema);

module.exports = Task;