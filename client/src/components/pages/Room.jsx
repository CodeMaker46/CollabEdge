import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { FaUser } from 'react-icons/fa';
import CollaborativeEditor from '../CollaborativeEditor';

const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const Room = () => {
  const { roomId } = useParams();
  console.log('Room ID:', roomId); // Debug log to verify route param
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const email = JSON.parse(localStorage.getItem('user'))?.email;

  useEffect(() => {
    let mounted = true;

    const initializeRoom = () => {
      if (!email) {
        toast.error('Please login to access the room');
        navigate('/login');
        return;
      }

      console.log('Initializing room connection...');
      console.log('Current user:', email);

      // Join room with roomId
      if (roomId && mounted) {
        socket.emit('join_room', { 
          roomCode: roomId,
          passCode: roomId,
          email 
        });
        console.log('Attempting to join room:', roomId);
      } else if (!roomId) {
        toast.error('Invalid room ID');
        navigate('/dashboard');
      }
    };

    // Socket connection handlers
    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setReconnecting(false);
      initializeRoom();
    });

    socket.on('room_joined', ({ room, message }) => {
      console.log('Successfully joined room:', room);
      console.log('Room details:', room);
      setRoomDetails(room);
      toast.success(message);
    });

    // Listen for user joined events
    socket.on('user_joined', ({ email: joinedEmail, activeUsers, room }) => {
      console.log('User joined:', joinedEmail);
      console.log('Active users:', activeUsers);
      if (mounted) {
        setActiveUsers(activeUsers || []);
        setRoomDetails(room);
        if (joinedEmail !== email) {
          toast.success(`${joinedEmail} joined the room`);
        }
      }
    });

    // Listen for user disconnected events
    socket.on('user_disconnected', ({ user }) => {
      setActiveUsers(prev => prev.filter(email => email !== user.email));
      toast.error(`${user.email} left the room`);
    });

    // Listen for room errors
    socket.on('room_error', ({ message }) => {
      toast.error(message);
      navigate('/dashboard');
    });

    return () => {
      mounted = false;
      socket.off('connect');
      socket.off('disconnect');
      socket.off('reconnecting');
      socket.off('reconnect_failed');
      socket.off('user_joined');
      socket.off('room_joined');
      socket.off('user_disconnected');
      socket.off('room_error');
      socket.disconnect();
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