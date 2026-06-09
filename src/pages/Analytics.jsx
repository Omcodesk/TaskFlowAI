import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    fetchAnalyticsOverview as fetchOverviewMetrics, 
    fetchStatusDistribution, 
    fetchProductivityTrend, 
    fetchEmployeeWorkload 
} from '../api/analytics';
import { AuthContext } from '../context/AuthProvider';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2, TrendingUp, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role !== 'Employee';

    const { data: overview, isLoading: load1 } = useQuery({ queryKey: ['analytics-overview'], queryFn: fetchOverviewMetrics });
    const { data: distribution, isLoading: load2 } = useQuery({ queryKey: ['analytics-distribution'], queryFn: fetchStatusDistribution });
    const { data: trend, isLoading: load3 } = useQuery({ queryKey: ['analytics-trend'], queryFn: fetchProductivityTrend });
    const { data: workload, isLoading: load4 } = useQuery({ queryKey: ['analytics-workload'], queryFn: fetchEmployeeWorkload, enabled: isAdmin });

    if (load1 || load2 || load3 || (isAdmin && load4)) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h1>
                <p className="text-gray-400 mt-2">Deep insights into productivity and team metrics.</p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { title: 'Total Tasks', value: overview?.totalTasks, icon: <CheckCircle2 className="text-blue-400" /> },
                    { title: 'Completed', value: overview?.completedTasks, icon: <CheckCircle2 className="text-emerald-400" /> },
                    { title: 'Pending', value: overview?.pendingTasks, icon: <AlertCircle className="text-yellow-400" /> },
                    { title: 'Overdue', value: overview?.overdueTasks, icon: <AlertCircle className="text-rose-400" /> },
                ].map((kpi, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={kpi.title} 
                        className="bg-[#111] p-6 rounded-2xl border border-white/5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-20">{kpi.icon}</div>
                        <p className="text-sm font-medium text-gray-500 mb-2">{kpi.title}</p>
                        <h3 className="text-3xl font-bold text-white">{kpi.value || 0}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Productivity Trend */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#111] p-6 rounded-2xl border border-white/5"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-lg font-semibold text-white">Productivity Trend (Last 7 Days)</h2>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                                <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#151515', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="completed" name="Tasks Completed" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Status Distribution */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#111] p-6 rounded-2xl border border-white/5"
                >
                    <h2 className="text-lg font-semibold text-white mb-6">Task Status Distribution</h2>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distribution || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(distribution || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#151515', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Employee Workload (Admin only) */}
                {isAdmin && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="col-span-1 lg:col-span-2 bg-[#111] p-6 rounded-2xl border border-white/5"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Users className="w-5 h-5 text-emerald-400" />
                            <h2 className="text-lg font-semibold text-white">Active Employee Workload</h2>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={workload || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                                    <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#151515', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="activeTasks" name="Active Tasks" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
