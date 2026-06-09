import Activity from '../models/Activity.js';

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({})
        .populate('user', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(20);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
