import React from 'react';
import Header from '../components/other/Header';
import KanbanBoard from '../components/Kanban/KanbanBoard';

const Kanban = () => {
    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
            <div className="max-w-[1600px] mx-auto p-6 md:p-8 flex flex-col h-screen">
                <Header />
                
                <div className="mt-8 mb-6 shrink-0">
                    <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Kanban Board</h2>
                    <p className="text-sm text-gray-400">Drag and drop tasks to update their status in real-time.</p>
                </div>

                <div className="flex-1 min-h-0">
                    <KanbanBoard />
                </div>
            </div>
        </div>
    );
};

export default Kanban;
