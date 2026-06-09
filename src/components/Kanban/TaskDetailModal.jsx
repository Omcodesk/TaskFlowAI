import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Clock, Loader2, Paperclip, File, Image as ImageIcon, Upload, Edit3 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../context/AuthProvider';
import apiClient from '../../api/client';
import { uploadAttachment } from '../../api/tasks';

const addCommentToTask = async ({ taskId, text }) => {
    const { data } = await apiClient.post(`/tasks/${taskId}/comments`, { text });
    return data;
};

const TaskDetailModal = ({ isOpen, onClose, task, onEditClick }) => {
    const { user } = React.useContext(AuthContext);
    const isAdminOrManager = user?.role !== 'Employee';
    const [commentText, setCommentText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const queryClient = useQueryClient();

    const addCommentMutation = useMutation({
        mutationFn: addCommentToTask,
        onSuccess: () => {
            setCommentText('');
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });

    if (!isOpen || !task) return null;

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        addCommentMutation.mutate({ taskId: task._id, text: commentText });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            await uploadAttachment({ taskId: task._id, file });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        } catch (error) {
            console.error('Failed to upload attachment:', error);
            alert('Failed to upload file. Ensure it is an image or document under 5MB.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const getFileIcon = (mimetype) => {
        if (mimetype?.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-emerald-400" />;
        return <File className="w-4 h-4 text-indigo-400" />;
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="bg-[#111] border-l border-white/10 w-full max-w-lg h-full shadow-2xl flex flex-col"
                >
                    <div className="p-6 border-b border-white/5 flex items-start justify-between bg-[#151515]">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400">
                                    {task.status}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-gray-500/10 text-gray-400">
                                    {task.priority}
                                </span>
                            </div>
                            <h2 className="text-xl font-semibold text-white leading-snug">{task.title}</h2>
                        </div>
                        <div className="flex gap-2">
                            {isAdminOrManager && (
                                <button onClick={onEditClick} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                                    <Edit3 className="w-5 h-5" />
                                </button>
                            )}
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                                {task.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 mb-8 text-sm border-b border-white/5 pb-8">
                            <div>
                                <span className="block text-gray-500 mb-1">Assignee</span>
                                {task.assignedTo ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                                            {task.assignedTo.firstName?.charAt(0)}
                                        </div>
                                        <span className="text-gray-300">{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-500 italic">Unassigned</span>
                                )}
                            </div>
                            <div>
                                <span className="block text-gray-500 mb-1">Due Date</span>
                                {task.dueDate ? (
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-500 italic">No date</span>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-400">Attachments</h3>
                                <div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileUpload} 
                                        className="hidden" 
                                        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.csv"
                                    />
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                    >
                                        {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                        Upload File
                                    </button>
                                </div>
                            </div>
                            
                            {task.attachments?.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {task.attachments.map((file, idx) => (
                                        <a 
                                            key={idx}
                                            href={`http://localhost:5000${file.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-[#1a1a1a] border border-white/5 hover:border-white/10 rounded-xl transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                {getFileIcon(file.mimetype)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-300 truncate group-hover:text-white transition-colors">{file.filename}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic px-4 py-3 bg-[#1a1a1a] rounded-xl border border-white/5">No attachments yet.</p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-4">Activity & Comments</h3>
                            <div className="space-y-4">
                                {task.comments?.length > 0 ? task.comments.map((comment, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                                            {comment.user?.firstName?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1 bg-[#1a1a1a] p-3.5 rounded-xl rounded-tl-none border border-white/5">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-white">{comment.user?.firstName || 'User'}</span>
                                                <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                                            </div>
                                            <p className="text-sm text-gray-300">{comment.text}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-sm text-gray-500 italic text-center py-4">No comments yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-white/5 bg-[#151515]">
                        <form onSubmit={handleSubmitComment} className="relative">
                            <input 
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment... (Type @ to mention)"
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                disabled={addCommentMutation.isPending}
                            />
                            <button 
                                type="submit"
                                disabled={!commentText.trim() || addCommentMutation.isPending}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
                            >
                                {addCommentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TaskDetailModal;
