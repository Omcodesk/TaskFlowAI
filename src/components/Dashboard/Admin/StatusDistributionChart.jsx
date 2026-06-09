import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchStatusDistribution } from '../../../api/analytics';

const StatusDistributionChart = () => {
    const { data = [], isLoading } = useQuery({
        queryKey: ['status-distribution'],
        queryFn: fetchStatusDistribution
    });

    if (isLoading) return (
        <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 h-full shadow-sm flex items-center justify-center text-gray-500">
            Loading chart...
        </div>
    );

    return (
        <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 h-full shadow-sm hover:border-white/10 transition-colors flex flex-col">
            <h3 className="text-lg font-medium text-white mb-2">Status Distribution</h3>
            <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
                {data.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        {entry.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusDistributionChart;
