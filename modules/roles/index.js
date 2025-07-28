const { 
    getRoles,
} = require('./controller');
const express = require('express')
const router = express.Router()

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles or a specific role
 *     description: Retrieve a list of all roles or a specific role by ID
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Role ID (optional)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       permissions:
 *                         type: array
 *                         items:
 *                           type: string
 *                       is_default:
 *                         type: boolean
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */

router.route('/roles').get(getRoles)

module.exports = router

