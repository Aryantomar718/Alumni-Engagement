import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import API from '../api/axios';
import { Send, Search, User as UserIcon } from 'lucide-react';

const Chat = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const scrollRef = useRef();

  // Fetch users we have chatted with
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const res = await API.get('/chat/users');
        setChatUsers(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChatUsers();
  }, []);

  // Fetch selected user details
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const res = await API.get(`/users/${userId}`);
          setSelectedUser(res.data.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUser();
    }
  }, [userId]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (userId) {
      const fetchMessages = async () => {
        try {
          const res = await API.get(`/chat/messages/${userId}`);
          setMessages(res.data.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [userId]);

  // Handle incoming messages via socket
  useEffect(() => {
    if (socket) {
      socket.on('receive_chat_message', (message) => {
        if (message.sender === userId) {
          setMessages((prev) => [...prev, message]);
        }
      });
      return () => socket.off('receive_chat_message');
    }
  }, [socket, userId]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    const messageData = {
      recipientId: userId,
      content: newMessage
    };

    try {
      const res = await API.post('/chat/messages', messageData);
      const savedMsg = res.data.data;
      
      // Emit via socket
      socket.emit('send_chat_message', { 
        recipientId: userId, 
        message: savedMsg 
      });

      setMessages((prev) => [...prev, savedMsg]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white saas-card overflow-hidden">
      {/* Sidebar - Contacts */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Loading conversations...</div>
          ) : chatUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No conversations yet</div>
          ) : (
            chatUsers.map((u) => (
              <div 
                key={u._id}
                onClick={() => navigate(`/chat/${u._id}`)}
                className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-blue-50 transition-colors ${userId === u._id ? 'bg-blue-50 border-r-4 border-blue-600' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                  <p className="text-xs text-gray-500 truncate">{u.role}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/50">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-xs text-green-500 font-medium">Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => {
                const isMe = msg.sender === currentUser._id;
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 saas-card rounded-tl-none'
                    }`}>
                      {msg.content}
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 p-2 bg-gray-50 border-none rounded-lg focus:ring-0 text-sm"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare size={64} className="mb-4 opacity-20" />
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
