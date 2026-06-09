import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles, CheckCircle2, AlertCircle, Clock, Tag, User, Briefcase, AlignLeft } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../../../api/tasks';
import { breakdownTask, suggestPriority, improveDescription } from '../../../api/ai';
import { fetchUsers } from '../../../api/users';
import { fetchProjects } from '../../../api/projects';

const CreateTaskModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Todo',
        dueDate: '',
        assignedTo: '',
        projectId: '',
        tags: ''
    });

    const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

    const queryClient = useQueryClient();

    // Fetch dropdown data
    const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: fetchUsers, enabled: isOpen });
    const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects, enabled: isOpen });

    // Keyboard Accessibility (ESC to close)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Show Toast Helper
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    // Mutations
    const { mutate: create, isPending: isSubmitting } = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            showToast('success', 'Task created successfully!');
            setTimeout(() => {
                onClose();
                setFormData({ title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '', assignedTo: '', projectId: '', tags: '' });
            }, 1000);
        },
        onError: (err) => {
            showToast('error', err.response?.data?.message || 'Failed to create task');
        }
    });

    const { mutate: handleBreakdown, isPending: isBreakingDown } = useMutation({
        mutationFn: breakdownTask,
        onSuccess: (data) => {
            setFormData(prev => ({ ...prev, description: data.description, priority: data.priority, dueDate: data.dueDate }));
            showToast('success', 'AI generated task breakdown!');
        }
    });

    const { mutate: handleSuggestPriority, isPending: isSuggestingPriority } = useMutation({
        mutationFn: ({ title, description }) => suggestPriority(title, description),
        onSuccess: (data) => {
            setFormData(prev => ({ ...prev, priority: data.priority }));
            showToast('success', `AI suggested Priority: ${data.priority}`);
        }
    });

    const { mutate: handleImproveDesc, isPending: isImprovingDesc } = useMutation({
        mutationFn: improveDescription,
        onSuccess: (data) => {
            setFormData(prev => ({ ...prev, description: data.improved }));
            showToast('success', 'AI improved description!');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return showToast('error', 'Title is required');
        
        const payload = { ...formData };
        if (payload.tags) {
            payload.tags = payload.tags.split(',').map(t => t.trim()).filter(Boolean);
        } else {
            payload.tags = [];
        }
        if (!payload.assignedTo) delete payload.assignedTo;
        if (!payload.projectId) delete payload.projectId;

        create(payload);
    };

    const isFormValid = formData.title.trim().length > 0;
    const isAiGenerating = isBreakingDown || isSuggestingPriority || isImprovingDesc;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
            >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-6xl max-h-[90vh] bg-[#111115] border border-[#2a2a35] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative"
                >
                    {/* Toast Notification */}
                    <AnimatePresence>
                        {toast && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20, x: '-50%' }}
                                animate={{ opacity: 1, y: 0, x: '-50%' }}
                                exit={{ opacity: 0, y: -20, x: '-50%' }}
                                className={`absolute top-4 left-1/2 z-50 px-4 py-2 rounded-full border shadow-lg flex items-center gap-2 text-sm font-medium
                                    ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}
                                `}
                            >
                                {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {toast.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Left Column: Form */}
                    <div className="flex-1 flex flex-col overflow-y-auto border-r border-[#2a2a35] custom-scrollbar">
                        <div className="p-6 md:p-8 flex-1">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white tracking-tight">Create Issue</h2>
                                <button onClick={onClose} className="text-gray-500 hover:text-white bg-[#1a1a24] hover:bg-[#2a2a35] p-2 rounded-lg transition-all md:hidden">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form id="create-task-form" onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Title */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title *</label>
                                        <span className="text-xs text-gray-600">{formData.title.length}/100</span>
                                    </div>
                                    <input 
                                        required
                                        maxLength={100}
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-[#1a1a24] border border-[#2a2a35] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-xl outline-none text-white transition-all text-sm"
                                        placeholder="What needs to be done?"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* AI Assistant Section */}
                                <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">AI Assistant</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            disabled={formData.title.length < 3 || isAiGenerating}
                                            onClick={() => handleBreakdown(formData.title)}
                                            className="px-3 py-1.5 bg-[#1a1a24] hover:bg-indigo-500/20 border border-[#2a2a35] hover:border-indigo-500/30 rounded-lg text-xs font-medium text-gray-300 hover:text-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                        >
                                            {isBreakingDown ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Breakdown Task'}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={formData.title.length < 3 || isAiGenerating}
                                            onClick={() => handleSuggestPriority({ title: formData.title, description: formData.description })}
                                            className="px-3 py-1.5 bg-[#1a1a24] hover:bg-indigo-500/20 border border-[#2a2a35] hover:border-indigo-500/30 rounded-lg text-xs font-medium text-gray-300 hover:text-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                        >
                                            {isSuggestingPriority ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Suggest Priority'}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={formData.description.length < 10 || isAiGenerating}
                                            onClick={() => handleImproveDesc({ text: formData.description })}
                                            className="px-3 py-1.5 bg-[#1a1a24] hover:bg-indigo-500/20 border border-[#2a2a35] hover:border-indigo-500/30 rounded-lg text-xs font-medium text-gray-300 hover:text-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                        >
                                            {isImprovingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Improve Desc'}
                                        </button>
                                    </div>
                                </div>

                                {/* Multi-column meta data */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Status */}
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Status
                                        </label>
                                        <select 
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-lg outline-none text-white text-sm focus:border-indigo-500 transition-all cursor-pointer"
                                            disabled={isSubmitting}
                                        >
                                            {['Backlog', 'Todo', 'In Progress', 'Review', 'Blocked', 'Completed'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Priority */}
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <AlertCircle className="w-3.5 h-3.5" /> Priority
                                        </label>
                                        <select 
                                            value={formData.priority}
                                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                            className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-lg outline-none text-white text-sm focus:border-indigo-500 transition-all cursor-pointer"
                                            disabled={isSubmitting}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>

                                    {/* Assignee */}
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" /> Assignee
                                        </label>
                                        <select 
                                            value={formData.assignedTo}
                                            onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                                            className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-lg outline-none text-white text-sm focus:border-indigo-500 transition-all cursor-pointer"
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Unassigned</option>
                                            {users.map(u => (
                                                <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Project */}
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <Briefcase className="w-3.5 h-3.5" /> Project
                                        </label>
                                        <select 
                                            value={formData.projectId}
                                            onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                                            className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-lg outline-none text-white text-sm focus:border-indigo-500 transition-all cursor-pointer"
                                            disabled={isSubmitting}
                                        >
                                            <option value="">No Project</option>
                                            {projects.map(p => (
                                                <option key={p._id} value={p._id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Due Date */}
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" /> Due Date
                                        </label>
                                        <input 
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                            className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-lg outline-none text-white text-sm focus:border-indigo-500 transition-all [color-scheme:dark] cursor-pointer"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <Tag className="w-3.5 h-3.5" /> Tags
                                        </label>
                                        <input 
                                            value={formData.tags}
                                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                            placeholder="bug, frontend, urgent..."
                                            className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a35] rounded-lg outline-none text-white text-sm focus:border-indigo-500 transition-all"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <AlignLeft className="w-3.5 h-3.5" /> Description
                                        </label>
                                        <span className="text-xs text-gray-600">{formData.description.length}/2000</span>
                                    </div>
                                    <textarea 
                                        maxLength={2000}
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        rows={5}
                                        className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a35] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-xl outline-none text-white transition-all text-sm resize-none custom-scrollbar"
                                        placeholder="Add more details to this issue..."
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </form>
                        </div>
                        
                        {/* Action Footer */}
                        <div className="p-4 md:p-6 border-t border-[#2a2a35] bg-[#111115] flex gap-3 justify-end sticky bottom-0">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-400 hover:text-white bg-[#1a1a24] hover:bg-[#2a2a35] rounded-xl transition-all"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                form="create-task-form"
                                disabled={!isFormValid || isSubmitting}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Issue'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Live Preview */}
                    <div className="hidden md:flex w-[400px] bg-[#0c0c0f] flex-col relative">
                        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all z-10">
                            <X className="w-4 h-4" />
                        </button>
                        
                        <div className="p-8 border-b border-white/5">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Live Preview</h3>
                            <p className="text-sm text-gray-400">See how your task will appear on the board.</p>
                        </div>
                        
                        <div className="p-8 flex-1 flex items-start justify-center pt-16">
                            {/* Mock Task Card */}
                            <div className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-xl p-5 shadow-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${
                                            formData.priority === 'Critical' ? 'bg-red-500' :
                                            formData.priority === 'High' ? 'bg-orange-500' :
                                            formData.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`} />
                                        <span className="text-xs font-semibold text-gray-400">{formData.priority}</span>
                                    </div>
                                    {formData.tags && formData.tags.split(',')[0].trim() && (
                                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                                            {formData.tags.split(',')[0].trim()}
                                        </span>
                                    )}
                                </div>
                                
                                <h4 className="text-base font-semibold text-white leading-tight mb-2 break-words">
                                    {formData.title || <span className="text-gray-600">Untitled Issue...</span>}
                                </h4>
                                
                                <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                                    {formData.description || 'No description provided.'}
                                </p>
                                
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        {formData.assignedTo ? (
                                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 ring-2 ring-[#1a1a24]">
                                                {users.find(u => u._id === formData.assignedTo)?.firstName?.charAt(0) || '?'}
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full border border-dashed border-gray-600 flex items-center justify-center text-[10px] text-gray-500">
                                                ?
                                            </div>
                                        )}
                                        <span className="text-xs font-medium text-gray-400">
                                            {formData.assignedTo 
                                                ? users.find(u => u._id === formData.assignedTo)?.firstName 
                                                : 'Unassigned'}
                                        </span>
                                    </div>
                                    
                                    {formData.dueDate && (
                                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(formData.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreateTaskModal;
