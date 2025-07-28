const express = require('express');
const router = express.Router();
const userRoutes = require('../modules/user/index');
const roleRoutes = require('../modules/roles/index');
const taskRoutes = require('../modules/tasks/task/index');
const taskAssignmentRoutes = require('../modules/tasks/task_assignment/index');
const goalRoutes = require('../modules/goals/goals/index');
const goalAssignmentRoutes = require('../modules/goals/goal_assignment/index');


const aiSessionRoutes = require('../modules/ai-assistant/sessions/index');
const aiChatRoutes = require('../modules/ai-assistant/chats/index');


// GOAL and Tasks flow managed by AI Assistant/Manual  
const aiGoalRoutes = require('../modules/ai-assistant/ai-goals/ai_goals/index');
const aiGoalAssignmentRoutes = require('../modules/ai-assistant/ai-goals/ai_goal_assignment/index');
const aiTaskRoutes = require('../modules/ai-assistant/ai-tasks/ai_task/index');
const aiTaskAssignmentRoutes = require('../modules/ai-assistant/ai-tasks/ai_task_assignment/index');


// TEST LEAD 
const leadRoutes = require('../modules/leads');
const siteVisitRoutes = require('../modules/site-visits');

const {
    createUser,
    loginUser,
    logoutUser,
    getToken
} = require('../modules/user/controller');
const auth = require("../middleware/authentication");
const { checkPermission } = require('../middleware/permissions');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               number:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 * 
 * /login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and get access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username_or_email
 *               - password
 *             properties:
 *               username_or_email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 * 
 * /token:
 *   post:
 *     summary: Refresh access token
 *     description: Get new access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - refreshToken
 *             properties:
 *               id:
 *                 type: string
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Invalid refresh token
 *       403:
 *         description: Forbidden
 * 
 * /logout:
 *   put:
 *     summary: Logout user
 *     description: Invalidate refresh token
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       404:
 *         description: User not found
 */

router.route('/register').post(createUser)
router.route('/token').post(getToken)
router.route('/login').post(loginUser)
router.route('/logout').put(logoutUser)

// Authenticate All routes other then Authentication system routes above
router.use(auth)

// router.use(checkPermission)

router.use(roleRoutes);
router.use(userRoutes);
router.use(goalRoutes);
router.use(goalAssignmentRoutes);
router.use(taskRoutes);
router.use(taskAssignmentRoutes);

router.use(aiSessionRoutes);
router.use(aiChatRoutes);
router.use(aiGoalRoutes);
router.use(aiGoalAssignmentRoutes);
router.use(aiTaskRoutes);
router.use(aiTaskAssignmentRoutes);

router.use(leadRoutes);
router.use(siteVisitRoutes);

module.exports = router;