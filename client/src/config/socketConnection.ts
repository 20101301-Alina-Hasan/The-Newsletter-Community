import { io } from 'socket.io-client';

// Initialize the socket connection
const socket = io('http://localhost:3000');

const connectSocket = () => {
    // Handle socket connection
    socket.on('connect', () => {
        console.log('Server Connected', socket.id);
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
        console.log('Server Disconnected');
    });
}


// Ensure proper cleanup
const disconnectSocket = () => {
    socket.disconnect();
    console.log('Socket disconnected cleanly');
};

// Export the socket and cleanup function if needed
export { connectSocket, disconnectSocket };
