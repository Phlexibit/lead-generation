const mongoose = require("mongoose");

const aiGoalAssignmentSchema = new mongoose.Schema(
  {
    ai_goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIGoal',
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

const AIGoalAssignment = mongoose.model("AIGoalAssignment", aiGoalAssignmentSchema);

module.exports = AIGoalAssignment;