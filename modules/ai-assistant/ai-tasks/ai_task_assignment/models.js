const mongoose = require("mongoose");

const aiTaskAssignmentSchema = new mongoose.Schema(
  {
    ai_task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AITask',
      required: true
    },
    assigned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const AITaskAssignment = mongoose.model("AITaskAssignment", aiTaskAssignmentSchema);

module.exports = AITaskAssignment;