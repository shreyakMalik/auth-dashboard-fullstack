const User = require('../models/User');

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt')
      .exec();

    const count = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalUsers: count
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching users'
    });
  }
};

/**
 * @desc    Get single user (Admin only)
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching user'
    });
  }
};

/**
 * @desc    Update user (Admin only)
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating user'
    });
  }
};

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error deleting user'
    });
  }
};
