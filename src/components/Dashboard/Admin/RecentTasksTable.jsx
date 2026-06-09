import React, { useContext, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTasks } from '../../../api/tasks';
import { Loader2 } from 'lucide-react';
import { SocketContext } from '../../../context/SocketProvider';

const RecentTasksTable = () => {
    const { data: tasks = [], isLoading, isError } = useQuery({
        queryKey: ['tasks'],
        queryFn: fetchTasks
    });

    const socket = useContext(SocketContext);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;
        
        const handleUpdate = () => {
            queryClient.invalidateQueries(['tasks']);
        };

        socket.on('task created', handleUpdate);
        socket.on('task updated', handleUpdate);

        return () => {
            socket.off('task created', handleUpdate);
            socket.off('task updated', handleUpdate);
        };
    }, [socket, queryClient]);

    if (isLoading) {
        return (
            <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 h-full flex items-center justify-center">
                <p className="text-red-400">Failed to load tasks.</p>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Review': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'Blocked': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        }
    };

    const getPriorityStyle = (priority) => {
        switch(priority) {
            case 'Urgent': return 'text-rose-400';
            case 'High': return 'text-orange-400';
            case 'Medium': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 shadow-sm hover:border-white/10 transition-colors overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Recent Tasks</h3>
                <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    View All
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
                            <th className="pb-3 font-medium">Task ID</th>
                            <th className="pb-3 font-medium">Title</th>
                            <th className="pb-3 font-medium">Assignee</th>
                            <th className="pb-3 font-medium">Status</th>
                            <th className="pb-3 font-medium">Priority</th>
                            <th className="pb-3 font-medium text-right">Due Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-500">No tasks found. Create one to get started.</td>
                            </tr>
                        ) : (
                            tasks.slice(0, 8).map((task) => (
                                <tr key={task._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                    <td className="py-4 text-gray-400 font-mono text-xs">{task._id.substring(18, 24).toUpperCase()}</td>
                                    <td className="py-4 font-medium text-white">{task.title}</td>
                                    <td className="py-4 text-gray-300">
                                        <div className="flex items-center gap-2">
                                            {task.assignedTo ? (
                                                <>
                                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-semibold text-indigo-400">
                                                        {task.assignedTo.firstName.charAt(0)}
                                                    </div>
                                                    {task.assignedTo.firstName} {task.assignedTo.lastName}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-6 h-6 rounded-full border border-dashed border-gray-600 flex items-center justify-center" />
                                                    Unassigned
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <span className={`font-medium ${getPriorityStyle(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right text-gray-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTasksTable;
