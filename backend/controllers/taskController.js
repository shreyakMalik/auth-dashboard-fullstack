const Task = require('../models/Task');

/**
 * @desc    Get all tasks (with filtering and pagination)
 * @route   GET /api/v1/tasks
 * @access  Private
 */
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Build query
    const query = { user: req.user.id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Execute query with pagination
    const tasks = await Task.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const count = await Task.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalTasks: count
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching tasks'
    });
  }
};

/**
 * @desc    Get single task
 * @route   GET /api/v1/tasks/:id
 * @access  Private
 */
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    // Check if user owns the task or is admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { task }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching task'
    });
  }
};

/**
 * @desc    Create new task
 * @route   POST /api/v1/tasks
 * @access  Private
 */
exports.createTask = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const task = await Task.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating task'
    });
  }
};

/**
 * @desc    Update task
 * @route   PUT /api/v1/tasks/:id
 * @access  Private
 */
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    // Check if user owns the task or is admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this task'
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating task'
    });
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    // Check if user owns the task or is admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this task'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error deleting task'
    });
  }
};

/**
 * @desc    Get task statistics
 * @route   GET /api/v1/tasks/stats
 * @access  Private
 */
exports.getTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTasks = await Task.countDocuments({ user: req.user.id });

    res.status(200).json({
      status: 'success',
      data: {
        totalTasks,
        byStatus: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching task statistics'
    });
  }
};
