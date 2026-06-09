import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, markNotificationAsRead } from '../../api/notifications';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

const NotificationBell = ({ socket }) => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications'],
        queryFn: fetchNotifications
    });

    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    useEffect(() => {
        if (!socket) return;
        socket.on('new notification', () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        });
        return () => socket.off('new notification');
    }, [socket, queryClient]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0a0a0a]"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 bg-[#151515] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#111]">
                                <h3 className="font-medium text-white text-sm">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">{unreadCount} new</span>
                                )}
                            </div>
                            
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-gray-500">No notifications yet</div>
                                ) : (
                                    notifications.map(notif => (
                                        <div key={notif._id} className={`p-4 border-b border-white/5 flex gap-3 ${notif.isRead ? 'opacity-60' : 'bg-indigo-500/5'}`}>
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                                                {notif.sender?.firstName?.charAt(0) || 'S'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-300 leading-snug">
                                                    <span className="font-medium text-white">{notif.sender?.firstName}</span> {notif.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</p>
                                            </div>
                                            {!notif.isRead && (
                                                <button 
                                                    onClick={() => markAsReadMutation.mutate(notif._id)}
                                                    className="shrink-0 p-1.5 hover:bg-white/5 rounded-lg text-indigo-400 hover:text-indigo-300"
                                                    title="Mark as read"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
