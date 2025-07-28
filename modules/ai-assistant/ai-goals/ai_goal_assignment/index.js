const { 
    createAssignment,
    deleteAssignment
} = require('./controller');
const express = require('express')
const router = express.Router()

router.route('/ai-assign-goal').post(createAssignment).delete(deleteAssignment)

module.exports = router

