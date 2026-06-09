import Activity from '../models/Activity.js';
import { getIO } from '../socket.js';

export const logActivity = async (userId, action, targetType, targetId, details) => {
    try {
        const activity = await Activity.create({
            user: userId,
            action,
            targetType,
            targetId,
            details
        });

        const populatedActivity = await Activity.findById(activity._id).populate('user', 'firstName lastName email');

        try {
            const io = getIO();
            io.emit('new activity', populatedActivity);
        } catch (err) {
            console.error('Socket error emitting activity:', err.message);
        }

        return activity;
    } catch (error) {
        console.error('Failed to log activity:', error.message);
    }
};
