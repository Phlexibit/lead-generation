const mongoose = require("mongoose");

const goalsSchema = new mongoose.Schema(
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
    // tasks: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Task'
    // }]
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.model("Goal", goalsSchema);

module.exports = Goal;