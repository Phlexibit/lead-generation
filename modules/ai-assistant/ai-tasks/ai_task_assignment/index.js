const { 
    createAssignment,
    deleteAssignment
} = require('./controller');
const express = require('express')
const router = express.Router()

router.route('/ai-assign-task').put(createAssignment).delete(deleteAssignment)

module.exports = router

