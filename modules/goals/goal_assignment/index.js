const { 
    createAssignment,
    deleteAssignment
} = require('./controller');
const express = require('express')
const router = express.Router()

/**
 * @swagger
 * /assign-goal:
 *   post:
 *     summary: Assign a goal to a user
 *     description: Create a new goal assignment
 *     tags: [Goal Assignments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goal_id
 *               - assigned_to
 *             properties:
 *               goal_id:
 *                 type: string
 *                 description: ID of the goal to assign
 *               assigned_to:
 *                 type: string
 *                 description: ID of the user to assign the goal to
 *     responses:
 *       201:
 *         description: Goal assigned successfully
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
 *                     goal:
 *                       type: object
 *                     assigned_by:
 *                       type: object
 *                     assigned_to:
 *                       type: object
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Goal or user not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Remove a goal assignment
 *     description: Delete a goal assignment
 *     tags: [Goal Assignments]
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
 *               - goal_id
 *             properties:
 *               assignment_id:
 *                 type: string
 *                 description: ID of the goal assignment to remove
 *               goal_id:
 *                 type: string
 *                 description: ID of the goal
 *     responses:
 *       200:
 *         description: Goal assignment removed successfully
 *       404:
 *         description: Goal or assignment not found
 *       500:
 *         description: Server error
 */

router.route('/assign-goal').post(createAssignment).delete(deleteAssignment)

module.exports = router

