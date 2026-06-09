import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthProvider';
import { useQueryClient } from '@tanstack/react-query';

export const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (user) {
            const newSocket = io(SOCKET_URL);
            setSocket(newSocket);

            newSocket.emit('setup', user);
            newSocket.on('connected', () => console.log('Connected to real-time server'));

            newSocket.on('task created', () => {
                queryClient.invalidateQueries({ queryKey: ['tasks'] });
                queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
                queryClient.invalidateQueries({ queryKey: ['status-distribution'] });
            });

            newSocket.on('task updated', () => {
                queryClient.invalidateQueries({ queryKey: ['tasks'] });
                queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
                queryClient.invalidateQueries({ queryKey: ['status-distribution'] });
            });

            newSocket.on('new activity', () => {
                queryClient.invalidateQueries({ queryKey: ['activities'] });
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user, queryClient]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
