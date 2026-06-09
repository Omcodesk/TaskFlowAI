import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, MessageSquare, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

const KanbanCard = ({ task, index, onClick }) => {
    const priorityColors = {
        'Low': 'bg-gray-500/10 text-gray-400',
        'Medium': 'bg-blue-500/10 text-blue-400',
        'High': 'bg-amber-500/10 text-amber-400',
        'Critical': 'bg-rose-500/10 text-rose-400'
    };

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={onClick}
                    className={`bg-[#1a1a1a] p-4 rounded-xl border ${
                        snapshot.isDragging ? 'border-indigo-500 shadow-xl shadow-indigo-500/10' : 'border-white/5 hover:border-white/10'
                    } transition-colors group cursor-grab active:cursor-grabbing mb-3`}
                >
                    <div className="flex items-start justify-between mb-3 gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${priorityColors[task.priority] || priorityColors['Medium']}`}>
                            {task.priority}
                        </span>
                    </div>

                    <h4 className="text-sm font-medium text-white mb-2 leading-snug group-hover:text-indigo-400 transition-colors">
                        {task.title}
                    </h4>

                    {task.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            {task.comments?.length > 0 && (
                                <div className="flex items-center gap-1 text-gray-500 text-xs">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>{task.comments.length}</span>
                                </div>
                            )}
                            {task.attachments?.length > 0 && (
                                <div className="flex items-center gap-1 text-gray-500 text-xs">
                                    <Paperclip className="w-3.5 h-3.5" />
                                    <span>{task.attachments.length}</span>
                                </div>
                            )}
                            {task.dueDate && (
                                <div className={`flex items-center gap-1 text-xs ${new Date(task.dueDate) < new Date() ? 'text-rose-400' : 'text-gray-500'}`}>
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                                </div>
                            )}
                        </div>

                        {task.assignedTo && (
                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0" title={`${task.assignedTo.firstName} ${task.assignedTo.lastName}`}>
                                {task.assignedTo.firstName?.charAt(0)}{task.assignedTo.lastName?.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default KanbanCard;
