import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, Users, LayoutList } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsOverview } from '../../../api/analytics';

const OverviewCards = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['analytics-overview'],
        queryFn: fetchAnalyticsOverview
    });

    const stats = [
        { label: 'Total Tasks', value: data?.totalTasks || 0, icon: LayoutList, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: 'Completed', value: data?.completedTasks || 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Pending', value: data?.pendingTasks || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Overdue', value: data?.overdueTasks || 0, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        { label: 'Active Users', value: data?.activeUsers || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    ];

    if (isLoading) return <div className="h-32 flex items-center justify-center text-gray-500">Loading metrics...</div>;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map((stat, idx) => {
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
                        <h3 className="text-3xl font-semibold text-white tracking-tight">{stat.value}</h3>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default OverviewCards;
