import React, { useContext, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTasks } from '../../../api/tasks';
import { SocketContext } from '../../../context/SocketProvider';

const MyTasksList = () => {
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

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'In Progress': return <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />;
            case 'Review': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            default: return <div className="w-5 h-5 rounded-full border-2 border-gray-500" />;
        }
    };

    return (
        <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 shadow-sm hover:border-white/10 transition-colors h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">My Active Tasks</h3>
                <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    View Kanban Board
                </button>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                {tasks.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No tasks assigned to you right now. 
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task._id} className="p-4 rounded-xl border border-white/5 bg-[#1a1a1a] hover:bg-[#202020] transition-colors cursor-pointer group flex items-start gap-4">
                            <div className="pt-0.5">{getStatusIcon(task.status)}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <h4 className="font-medium text-white group-hover:text-indigo-300 transition-colors truncate pr-4">{task.title}</h4>
                                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full shrink-0 ${task.priority === 'High' || task.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-gray-400'}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="text-indigo-400/80 font-medium">Platform Engineering</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyTasksList;
