import React from 'react';
import { motion } from 'framer-motion';

const PersonalActivityFeed = () => {
    const activities = [
        { action: 'You completed task', target: 'Optimize Database Queries', time: '10 mins ago', color: 'bg-emerald-500/20 text-emerald-400', initial: '✓' },
        { action: 'You were assigned to', target: 'Write API Documentation', time: '1 hour ago', color: 'bg-indigo-500/20 text-indigo-400', initial: '+' },
        { action: 'You commented on', target: 'Frontend UI Alignment', time: 'Yesterday', color: 'bg-blue-500/20 text-blue-400', initial: '💬' },
        { action: 'You moved task to', target: 'Review', time: 'Yesterday', color: 'bg-yellow-500/20 text-yellow-400', initial: '→' },
    ];

    return (
        <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 h-full shadow-sm hover:border-white/10 transition-colors">
            <h3 className="text-lg font-medium text-white mb-6">Your Recent Activity</h3>
            <div className="space-y-6">
                {activities.map((activity, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-4"
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${activity.color}`}>
                            {activity.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {activity.action} <span className="font-medium text-white">{activity.target}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                View All Activity
            </button>
        </div>
    );
};

export default PersonalActivityFeed;
