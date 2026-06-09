import Task from '../models/Task.js';
import User from '../models/User.js';

// @desc    Get dashboard overview metrics
// @route   GET /api/analytics/overview
// @access  Private
export const getOverviewMetrics = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Employee') {
            query = { assignedTo: req.user._id };
        }

        const totalTasks = await Task.countDocuments(query);
        const completedTasks = await Task.countDocuments({ ...query, status: 'Completed' });
        const pendingTasks = await Task.countDocuments({ ...query, status: { $ne: 'Completed' } });
        
        const now = new Date();
        const overdueTasks = await Task.countDocuments({ 
            ...query, 
            status: { $ne: 'Completed' }, 
            dueDate: { $lt: now } 
        });

        // Only count active users if the user is an admin/manager (or just return 0 for employees)
        let activeUsers = 0;
        if (req.user.role !== 'Employee') {
            activeUsers = await User.countDocuments();
        }

        res.json({
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
            activeUsers
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get task status distribution
// @route   GET /api/analytics/distribution
// @access  Private
export const getStatusDistribution = async (req, res) => {
    try {
        let match = {};
        if (req.user.role === 'Employee') {
            match = { assignedTo: req.user._id };
        }

        const distribution = await Task.aggregate([
            { $match: match },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Map colors to statuses for Recharts
        const colorMap = {
            'Todo': '#6366f1',
            'In Progress': '#3b82f6',
            'Review': '#eab308',
            'Completed': '#10b981',
            'Blocked': '#f43f5e',
            'Backlog': '#94a3b8',
            'Cancelled': '#64748b'
        };

        const formatted = distribution.map(d => ({
            name: d._id,
            value: d.count,
            color: colorMap[d._id] || '#ffffff'
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get productivity trend (last 7 days completed tasks)
// @route   GET /api/analytics/trend
// @access  Private
export const getProductivityTrend = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let match = {
            status: 'Completed',
            updatedAt: { $gte: sevenDaysAgo }
        };

        if (req.user.role === 'Employee') {
            match.assignedTo = req.user._id;
        }

        const trend = await Task.aggregate([
            { $match: match },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                    completed: { $sum: 1 } 
                } 
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(trend.map(t => ({ date: t._id, completed: t.completed })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get employee workload (Admin/Manager only)
// @route   GET /api/analytics/workload
// @access  Private
export const getEmployeeWorkload = async (req, res) => {
    try {
        if (req.user.role === 'Employee') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const workload = await Task.aggregate([
            { $match: { status: { $ne: 'Completed' }, assignedTo: { $ne: null } } },
            { $group: { _id: '$assignedTo', activeTasks: { $sum: 1 } } }
        ]);

        const populatedWorkload = await User.populate(workload, { path: '_id', select: 'firstName lastName' });

        const formatted = populatedWorkload.map(w => ({
            name: `${w._id?.firstName || 'Unknown'} ${w._id?.lastName || ''}`.trim(),
            activeTasks: w.activeTasks
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
