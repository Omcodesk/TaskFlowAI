import React, { useState, useEffect } from 'react';

const OnlineUsers = ({ socket }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (!socket) return;

        socket.on('active users update', (users) => {
            // Remove duplicates by _id (same user multiple tabs)
            const uniqueUsers = Array.from(new Map(users.map(u => [u._id, u])).values());
            setOnlineUsers(uniqueUsers);
        });

        return () => socket.off('active users update');
    }, [socket]);

    if (onlineUsers.length === 0) return null;

    // Show max 4 users, then +N
    const displayUsers = onlineUsers.slice(0, 4);
    const remaining = onlineUsers.length - displayUsers.length;

    return (
        <div className="flex items-center">
            <div className="flex -space-x-2 mr-2">
                {displayUsers.map(u => (
                    <div 
                        key={u._id} 
                        className="relative w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border-2 border-[#0a0a0a] flex items-center justify-center text-xs font-bold shrink-0"
                        title={`${u.firstName} ${u.lastName} (Online)`}
                    >
                        {u.firstName?.charAt(0)}
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#0a0a0a]"></span>
                    </div>
                ))}
                {remaining > 0 && (
                    <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-300 border-2 border-[#0a0a0a] flex items-center justify-center text-xs font-medium z-10">
                        +{remaining}
                    </div>
                )}
            </div>
            <span className="text-xs font-medium text-emerald-500 mr-4 hidden md:block">
                {onlineUsers.length} Online
            </span>
        </div>
    );
};

export default OnlineUsers;
