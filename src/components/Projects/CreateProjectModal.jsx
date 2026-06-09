import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '../../api/projects';

const CreateProjectModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [toast, setToast] = useState(null);

    const queryClient = useQueryClient();

    const createProjectMutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setToast({ type: 'success', message: 'Project created successfully!' });
            setTimeout(() => {
                setToast(null);
                onClose();
                setName('');
                setDescription('');
            }, 1500);
        },
        onError: (error) => {
            setToast({ type: 'error', message: error.response?.data?.message || 'Failed to create project' });
            setTimeout(() => setToast(null), 3000);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        createProjectMutation.mutate({ name, description });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative"
                >
                    {toast && (
                        <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50 ${
                            toast.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                        }`}>
                            {toast.message}
                        </div>
                    )}

                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <h2 className="text-xl font-semibold text-white tracking-tight">Create Project</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Name <span className="text-rose-500">*</span></label>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="e.g. Q3 Marketing Campaign"
                                required
                                disabled={createProjectMutation.isPending}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none h-24"
                                placeholder="Briefly describe the project goals..."
                                disabled={createProjectMutation.isPending}
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-5 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={!name.trim() || createProjectMutation.isPending}
                                className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
                            >
                                {createProjectMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Create Project
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateProjectModal;
