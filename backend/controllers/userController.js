import User from '../models/User.js';

// @desc    Get all users (for dropdowns)
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending users
// @route   GET /api/users/pending
// @access  Private/Admin
export const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ isApproved: false }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a user
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
export const approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isApproved = true;
            await user.save();
            res.json({ message: 'User approved' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject (delete) a pending user
// @route   DELETE /api/users/:id/reject
// @access  Private/Admin
export const rejectUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            res.json({ message: 'User rejected and removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetOmchaddhaUser = async (req, res) => {
    try {
        const emailToReset = 'omchaddha7@gmail.com';
        const user = await User.findOne({ email: emailToReset });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        import('bcryptjs').then(async (bcrypt) => {
            const hashedPassword = await bcrypt.default.hash('omchaddha', 10);
            user.password = hashedPassword;
            user.role = 'Admin';
            user.isApproved = true;
            await user.save();
            res.json({ message: 'Account successfully reset to Admin with password: omchaddha' });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
