import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '../../../api/activities';
import { formatDistanceToNow } from 'date-fns';

const ActivityFeed = () => {
    const { data: activities = [], isLoading } = useQuery({
        queryKey: ['activities'],
        queryFn: fetchActivities,
        refetchInterval: 10000 // Poll every 10s for now, socket.io will be added later
    });

    const getColorClass = (action) => {
        if (action.includes('created')) return 'bg-emerald-500/20 text-emerald-400';
        if (action.includes('moved')) return 'bg-indigo-500/20 text-indigo-400';
        if (action.includes('registered')) return 'bg-purple-500/20 text-purple-400';
        return 'bg-blue-500/20 text-blue-400';
    };

    return (
        <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 h-full shadow-sm hover:border-white/10 transition-colors flex flex-col">
            <h3 className="text-lg font-medium text-white mb-6">Recent Activity</h3>
            
            {isLoading ? (
                <div className="text-sm text-gray-500 text-center py-10">Loading activities...</div>
            ) : activities.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-10">No recent activity</div>
            ) : (
                <div className="space-y-6 overflow-y-auto custom-scrollbar flex-1 pr-2">
                    {activities.map((activity, idx) => (
                        <motion.div 
                            key={activity._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-4"
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${getColorClass(activity.action)}`}>
                                {activity.user?.firstName?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    <span className="font-medium text-white">{activity.user?.firstName} {activity.user?.lastName}</span> {activity.action} <span className="font-medium text-white">{activity.details}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
            <button className="w-full mt-6 py-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                View All Activity
            </button>
        </div>
    );
};

export default ActivityFeed;
