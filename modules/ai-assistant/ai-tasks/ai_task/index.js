const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('./controller');

router.route('/ai-task').get(getTasks).post(createTask)
router.route('/ai-task/:id').put(updateTask).delete(deleteTask)

module.exports = router

