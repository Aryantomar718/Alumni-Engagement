import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect to the backend socket server
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      
      setSocket(newSocket);

      // Join personal room
      newSocket.emit('join', user._id);

      // Listen for notification events
      newSocket.on('new_notification', (notification) => {
        toast.success(notification.message, {
          duration: 4000,
          position: 'top-right',
        });
        // We can also trigger a global notification state update here if we had one
      });

      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
