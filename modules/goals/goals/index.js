const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} = require('./controller');

router.route('/goal').get(getGoals).post(createGoal)
router.route('/goal/:id').put(updateGoal).delete(deleteGoal)

module.exports = router

