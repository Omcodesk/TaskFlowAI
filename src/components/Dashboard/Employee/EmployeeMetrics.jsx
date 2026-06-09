import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsOverview } from '../../../api/analytics';

const EmployeeMetrics = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics-overview'],
        queryFn: fetchAnalyticsOverview
    });

    const productivityScore = data && data.totalTasks > 0 
        ? Math.round((data.completedTasks / data.totalTasks) * 100) 
        : 0;

    const metrics = [
        { label: 'Pending Tasks', value: data?.pendingTasks || 0, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Overdue Tasks', value: data?.overdueTasks || 0, icon: Calendar, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        { label: 'Completed Tasks', value: data?.completedTasks || 0, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Productivity Score', value: `${productivityScore}%`, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    ];

    if (isLoading) return <div className="h-32 flex items-center justify-center text-gray-500">Loading metrics...</div>;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-5 rounded-2xl bg-[#151515] border border-white/5 flex flex-col gap-3 shadow-sm hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-400">{stat.label}</span>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <Icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="mt-1">
                            <h3 className="text-3xl font-semibold text-white tracking-tight">{stat.value}</h3>
                            {stat.subtext && <p className="text-xs text-emerald-400 mt-1.5 font-medium">{stat.subtext}</p>}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default EmployeeMetrics;
