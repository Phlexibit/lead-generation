const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  approveAIGoal
} = require('./controller');

router.route('/ai-goal').get(getGoals).post(createGoal)
router.route('/ai-goal/:id').put(updateGoal).delete(deleteGoal)

// Approve AI Goal which gets converted ti actual goal in the goals list
router.route('/approve-ai-goal').post(approveAIGoal)

module.exports = router

