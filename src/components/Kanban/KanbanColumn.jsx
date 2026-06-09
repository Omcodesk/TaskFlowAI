import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ columnId, title, tasks, onTaskClick }) => {
    return (
        <div className="flex flex-col bg-[#111] rounded-2xl border border-white/5 min-w-[300px] w-[300px] flex-shrink-0 h-full overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#151515]">
                <h3 className="font-medium text-sm text-gray-200">{title}</h3>
                <span className="text-xs font-medium text-gray-500 bg-black/40 px-2 py-0.5 rounded-full">{tasks.length}</span>
            </div>
            
            <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto custom-scrollbar p-3 transition-colors ${
                            snapshot.isDraggingOver ? 'bg-indigo-500/5' : ''
                        }`}
                    >
                        {tasks.map((task, index) => (
                            <KanbanCard key={task._id} task={task} index={index} onClick={() => onTaskClick(task)} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default KanbanColumn;
