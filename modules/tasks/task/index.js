const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('./controller');

router.route('/task').get(getTasks).post(createTask)
router.route('/task/:id').put(updateTask).delete(deleteTask)

module.exports = router

