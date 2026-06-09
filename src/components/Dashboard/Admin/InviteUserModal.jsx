import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle2 } from 'lucide-react';

const InviteUserModal = ({ isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);
    
    // Generate a simple registration link (in a real app, this would be a secure token link)
    const inviteLink = `${window.location.origin}/register`;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#151515] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white tracking-tight">Invite User</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            Copy the registration link below and send it to your team members so they can join the workspace.
                        </p>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Invite Link</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={inviteLink}
                                    className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none"
                                />
                                <button 
                                    onClick={handleCopy}
                                    className="flex items-center justify-center w-11 h-11 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 rounded-xl transition-colors"
                                >
                                    {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-0 flex justify-end gap-3 mt-2">
                        <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                            Done
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default InviteUserModal;
