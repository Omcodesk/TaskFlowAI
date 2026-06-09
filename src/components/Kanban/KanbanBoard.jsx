import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import TaskDetailModal from './TaskDetailModal';
import EditTaskModal from '../Dashboard/Admin/EditTaskModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, updateTaskStatus } from '../../api/tasks';

const COLUMNS = ['Backlog', 'Todo', 'In Progress', 'Review', 'Blocked', 'Completed'];

const KanbanBoard = () => {
    const queryClient = useQueryClient();
    const { data: rawTasks = [], isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: fetchTasks
    });

    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null);

    // Sync local state when remote data changes (React Query)
    useEffect(() => {
        setTasks(rawTasks);
    }, [rawTasks]);

    const updateStatusMutation = useMutation({
        mutationFn: updateTaskStatus,
        // Optimistic update is tricky with dnd, we already updated local state so we just invalidate on success
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
            queryClient.invalidateQueries({ queryKey: ['status-distribution'] });
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        }
    });

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Find the task being moved
        const draggedTask = tasks.find(t => t._id === draggableId);
        if (!draggedTask) return;

        const newStatus = destination.droppableId;

        // Optimistically update local UI state immediately
        const updatedTasks = tasks.map(t => {
            if (t._id === draggableId) {
                return { ...t, status: newStatus };
            }
            return t;
        });

        setTasks(updatedTasks);

        // Fire mutation to backend
        if (source.droppableId !== destination.droppableId) {
            updateStatusMutation.mutate({ taskId: draggableId, status: newStatus });
        }
    };

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center text-gray-500 h-full">Loading Board...</div>;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 h-[calc(100vh-220px)] overflow-x-auto custom-scrollbar pb-4">
                {COLUMNS.map(column => {
                    const columnTasks = tasks.filter(t => t.status === column);
                    return (
                        <KanbanColumn 
                            key={column} 
                            columnId={column} 
                            title={column} 
                            tasks={columnTasks}
                            onTaskClick={(task) => setSelectedTask(task)}
                        />
                    );
                })}
            </div>

            <TaskDetailModal 
                isOpen={!!selectedTask} 
                onClose={() => setSelectedTask(null)} 
                task={selectedTask} 
                onEditClick={() => {
                    setEditingTask(selectedTask);
                    setSelectedTask(null);
                }}
            />

            <EditTaskModal 
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                task={editingTask}
            />
        </DragDropContext>
    );
};

export default KanbanBoard;
