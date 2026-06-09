import React from 'react';
import { Plus, FolderPlus, UserPlus } from 'lucide-react';

const QuickActions = ({ onCreateTask, onCreateProject, onInviteUser }) => {
    return (
        <div className="flex flex-wrap gap-3 mb-8 mt-2">
            <button 
                onClick={onCreateTask}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                <Plus className="w-4 h-4" />
                Create Task
            </button>
            <button 
                onClick={onCreateProject}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-white/20 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
                <FolderPlus className="w-4 h-4 text-gray-400" />
                Create Project
            </button>
            <button 
                onClick={onInviteUser}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-white/20 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
                <UserPlus className="w-4 h-4 text-gray-400" />
                Invite User
            </button>
        </div>
    );
};

export default QuickActions;
