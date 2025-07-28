const { 
    createAssignment,
    deleteAssignment
} = require('./controller');
const express = require('express')
const router = express.Router()

/**
 * @swagger
 * /assign-task:
 *   post:
 *     summary: Assign a task to a user
 *     description: Create a new task assignment
 *     tags: [Task Assignments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task_id
 *               - assigned_to
 *             properties:
 *               task_id:
 *                 type: string
 *                 description: ID of the task to assign
 *               assigned_to:
 *                 type: string
 *                 description: ID of the user to assign the task to
 *     responses:
 *       201:
 *         description: Task assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       type: object
 *                     assigned_by:
 *                       type: object
 *                     assigned_to:
 *                       type: object
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Task or user not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Remove a task assignment
 *     description: Delete a task assignment
 *     tags: [Task Assignments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignment_id
 *               - task_id
 *             properties:
 *               assignment_id:
 *                 type: string
 *                 description: ID of the task assignment to remove
 *               task_id:
 *                 type: string
 *                 description: ID of the task
 *     responses:
 *       200:
 *         description: Task assignment removed successfully
 *       404:
 *         description: Task or assignment not found
 *       500:
 *         description: Server error
 */

router.route('/assign-task').put(createAssignment).delete(deleteAssignment)

module.exports = router

