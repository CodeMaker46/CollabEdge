import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import CollaborativeEditor from '../CollaborativeEditor';

// Initialize socket connection
let socket;

const initSocket = () => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io('http://localhost:3000', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false
  });
  
  return socket;
};

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  
  // Get user email from localStorage
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const email = user?.email;

  // Get stored pass code from sessionStorage (persists during page reloads)
  const getStoredPassCode = () => {
    return sessionStorage.getItem(`room_passcode_${roomId}`);
  };

  // Store pass code in sessionStorage
  const storePassCode = (passcode) => {
    sessionStorage.setItem(`room_passcode_${roomId}`, passcode);
  };

  // Handle user exit
  const handleExit = () => {
    // Emit leave room event
    socket.emit('leave_room', { roomCode: roomId, email });
    
    // Clear session storage
    sessionStorage.removeItem(`room_passcode_${roomId}`);
    
    // Disconnect socket
    socket.disconnect();
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  useEffect(() => {
    let mounted = true;
    let currentSocket = null;

    // Check if user is logged in
    if (!email) {
      toast.error('Please login to access the room');
      navigate('/login');
      return;
    }

    // Check if roomId exists
    if (!roomId) {
      toast.error('Invalid room ID');
      navigate('/dashboard');
      return;
    }

    // Initialize socket connection
    currentSocket = initSocket();
    currentSocket.connect();

    console.log('Initializing room connection...');
    console.log('Current user:', email);

    // Socket connection handlers
    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setReconnecting(false);
      
      // Get stored pass code if available
      const storedPassCode = getStoredPassCode();
      
      // If we have a stored pass code, use it to rejoin the room
      if (storedPassCode) {
        console.log('Rejoining room with stored pass code');
        socket.emit('join_room', { 
          roomCode: roomId,
          passCode: storedPassCode,
          email 
        });
      } else {
        // First time joining - use roomId as pass code
        console.log('Joining room for the first time');
        socket.emit('join_room', { 
          roomCode: roomId,
          passCode: roomId,
          email 
        });
      }
    });

    socket.on('room_joined', ({ room, message }) => {
      console.log('Successfully joined room:', room);
      setRoomDetails(room);
      toast.success(message);
      
      // Always store the successful pass code from the room
      storePassCode(room.passCode || roomId);
    });

    // Listen for pass code errors
    socket.on('passcode_error', ({ message }) => {
      toast.error(message || 'Invalid pass code. Please check your pass code and try again.');
      
      // Clear stored pass code since it's invalid
      sessionStorage.removeItem(`room_passcode_${roomId}`);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    });

    // Handle general room errors
    socket.on('room_error', ({ message }) => {
      toast.error(message);
      
      // If error is about pass code, clear stored pass code
      if (message.includes('pass code') || message.includes('passcode')) {
        sessionStorage.removeItem(`room_passcode_${roomId}`);
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    });

    // Listen for user joined events
    socket.on('user_joined', ({ email: joinedEmail, activeUsers: users, room }) => {
      console.log('User joined:', joinedEmail);
      console.log('Active users:', users);
      if (mounted) {
        setActiveUsers(users || []);
        setRoomDetails(room);
        if (joinedEmail !== email) {
          toast.success(`${joinedEmail} joined the room`);
        }
      }
    });

    // Listen for user disconnected events
    socket.on('user_disconnected', ({ user: disconnectedUser, activeUsers: updatedUsers }) => {
      setActiveUsers(updatedUsers || []);
      toast.error(`${disconnectedUser.email} left the room`);
    });

  return () => {
    mounted = false;
    if (currentSocket) {
      currentSocket.off('connect');
      currentSocket.off('disconnect');
      currentSocket.off('reconnecting');
      currentSocket.off('reconnect_failed');
      currentSocket.off('user_joined');
      currentSocket.off('room_joined');
      currentSocket.off('user_disconnected');
      currentSocket.off('room_error');
      currentSocket.off('passcode_error');
      currentSocket.disconnect();
    }
  };
  }, [email, navigate, roomId]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-8">
        <header className="mb-8 bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10">
          <h1 className="text-3xl font-bold mb-4">{roomDetails?.name || 'Secure Room'}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/20">
              <FaUser className="text-green-400" />
              <span className="text-gray-400">
                Active Users: <span className="text-white">{activeUsers.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/20">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : reconnecting ? 'bg-yellow-400' : 'bg-red-400'}`} />
              <span className="text-gray-400">
                {isConnected ? 'Connected' : reconnecting ? 'Reconnecting...' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={handleExit}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full border border-red-500/20 hover:bg-red-500/30 transition-colors"
            >
              <FaSignOutAlt />
              Exit Room
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10">
            <h2 className="text-xl font-semibold mb-6">Workspace</h2>
            <div className="bg-white/5 rounded-lg p-4 border border-white/20 h-[600px] relative">
              <CollaborativeEditor roomId={roomId} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10">
            <h2 className="text-xl font-semibold mb-6">Active Users</h2>
            <div className="space-y-3">
              {activeUsers.map((user, index) => (
                <div
                  key={typeof user === 'string' ? user : user._id || index}
                  className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                >
                  <FaUser className="text-green-400" />
                  <span className="flex-1 text-gray-200">{typeof user === 'string' ? user : user.email}</span>
                  <span className="text-xs px-2 py-1 bg-green-400/10 text-green-400 rounded-full">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;