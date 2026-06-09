import { Server } from 'socket.io';

let io;
const connectedUsers = new Map(); // Map<socketId, userData>

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`Socket Connected: ${socket.id}`);

        // User authenticates/sets up their personal room
        socket.on('setup', (userData) => {
            if (userData?._id) {
                socket.join(userData._id);
                console.log(`User ${userData.firstName} joined personal room: ${userData._id}`);
                
                // Track online user
                connectedUsers.set(socket.id, {
                    _id: userData._id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    role: userData.role
                });

                // Broadcast updated online users list to all clients
                io.emit('active users update', Array.from(connectedUsers.values()));
                
                socket.emit('connected');
            }
        });

        // Join specific project or task rooms
        socket.on('join room', (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room: ${room}`);
        });

        socket.on('disconnect', () => {
            console.log(`Socket Disconnected: ${socket.id}`);
            if (connectedUsers.has(socket.id)) {
                connectedUsers.delete(socket.id);
                io.emit('active users update', Array.from(connectedUsers.values()));
            }
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
