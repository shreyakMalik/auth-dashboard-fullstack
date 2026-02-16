const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate, sanitizeInput } = require('../middleware/validation');

// Protect all routes
router.use(protect);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all tasks for current user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 */
router.get('/', getTasks);

/**
 * @swagger
 * /api/v1/tasks/stats:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats', getTaskStats);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get single task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 */
router.get('/:id', getTask);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create new task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post(
  '/',
  sanitizeInput,
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('dueDate').optional().isISO8601()
  ],
  validate,
  createTask
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put(
  '/:id',
  sanitizeInput,
  [
    body('title').optional().trim().isLength({ min: 3, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
  ],
  validate,
  updateTask
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete('/:id', deleteTask);

module.exports = router;
