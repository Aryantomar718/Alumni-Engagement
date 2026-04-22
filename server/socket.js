const { Server } = require('socket.io');

let io;

const init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Join a user-specific room
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`🏠 User ${userId} joined their personal room`);
    });

    // Handle sending a message
    socket.on('send_chat_message', (data) => {
      const { recipientId, message } = data;
      // Emit to the recipient's personal room
      io.to(recipientId).emit('receive_chat_message', message);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};

// Global helper to emit notifications
const emitNotification = (recipientId, notification) => {
  if (io) {
    io.to(recipientId.toString()).emit('new_notification', notification);
  }
};

module.exports = { init, getIO, emitNotification };
