import React, { useEffect, useState } from 'react';
import { Code2, Plus, LogIn, History, LayoutGrid, DoorOpen } from 'lucide-react';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getRooms, getUserHistory } from '../../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [viewHistory, setViewHistory] = useState(false);
  const [showRoomOption, setShowRoomOption] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
  const [createdRooms, setCreatedRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPasscode, setSelectedPasscode] = useState('');

  const dummyCreatedRooms = [
    { id: 'r1', name: 'React Collab', createdAt: '2025-04-01', passcode: 'RC123' },
    { id: 'r2', name: 'AI Project', createdAt: '2025-04-05', passcode: 'AI456' },
  ];
  const dummyHistory = [
    { id: 'h1', name: 'Node Room', joinedAt: '2025-03-25' },
    { id: 'h2', name: 'Design Talk', joinedAt: '2025-03-30' },
  ];

  const email = JSON.parse(localStorage.getItem('user'))?.email;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      toast.success('Signed out successfully!');
      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error('Error signing out');
    }
  };

  const fetchUserData = async () => {
    try {
      const roomsData = await getRooms(email);
      const historyData = await getUserHistory(email);
      setCreatedRooms(roomsData);
      setJoinedRooms(historyData);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching user data');
    }
  };

  useEffect(() => {
    if (email) {
      // fetchUserData();
      setCreatedRooms(dummyCreatedRooms);
      setJoinedRooms(dummyHistory);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-8 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="w-8 h-8" />
            <span className="text-xl font-bold">CollabEdge</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowRoomOption(prev => !prev)}
              className="bg-white/10 text-white px-6 py-2 rounded-full font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <DoorOpen className="w-4 h-4" />
              {showRoomOption ? 'Hide Options' : 'Create / Join'}
            </button>

            <button
              onClick={() => {
                setViewHistory(prev => !prev);
                setShowRoomOption(false);
              }}
              className="bg-white/10 text-white px-6 py-2 rounded-full font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              {viewHistory ? <LayoutGrid className="w-4 h-4" /> : <History className="w-4 h-4" />}
              {viewHistory ? 'Show Created Rooms' : 'Show History'}
            </button>

            <button
              onClick={handleSignOut}
              className="bg-white/10 text-white px-6 py-2 rounded-full font-medium hover:bg-white/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">
          {showRoomOption
            ? isCreating
              ? 'Create a Room'
              : 'Join a Room'
            : viewHistory
              ? 'Room History'
              : 'Created Rooms'}
        </h2>

        {/* Create/Join Section */}
        {showRoomOption && (
          <div className="max-w-xl mx-auto">
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setIsCreating(true)}
                className={`px-6 py-2 rounded-l-full border ${
                  isCreating ? 'bg-white text-black' : 'bg-white/10 text-white'
                } transition-colors`}
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className={`px-6 py-2 rounded-r-full border ${
                  !isCreating ? 'bg-white text-black' : 'bg-white/10 text-white'
                } transition-colors`}
              >
                Join
              </button>
            </div>

            <div>
              {isCreating ? (
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/10 p-4 rounded-full mb-6">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Create Room</h3>
                  <p className="text-gray-400 mb-6">
                    Start a new collaboration room and invite your team members
                  </p>
                  <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors w-full max-w-xs">
                    Create New Room
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/10 p-4 rounded-full mb-6">
                    <LogIn className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Join Room</h3>
                  <p className="text-gray-400 mb-6">
                    Enter a room code to join an existing collaboration session
                  </p>
                  <div className="w-full max-w-xs space-y-4">
                    <input
                      type="text"
                      placeholder="Enter room code"
                      className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                    />
                    <input
                      type="text"
                      placeholder="Enter Pass code"
                      className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                    />
                    <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors w-full">
                      Join Room
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Show Created Rooms or History */}
        {!showRoomOption && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {(viewHistory ? joinedRooms : createdRooms).map((room, idx) => (
              <div
                key={room.id || idx}
                className="p-6 rounded-xl border border-white/10 hover:border-white/20 relative"
              >
                <h4 className="text-lg font-semibold mb-2">{room.name}</h4>
                <p className="text-sm text-gray-400 mb-4">
                  {viewHistory
                    ? `Joined on ${room.joinedAt}`
                    : `Created on ${room.createdAt}`}
                </p>

                {!viewHistory && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedPasscode(room.passcode);
                        setShowModal(true);
                      }}
                      className="text-sm px-4 py-1 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition"
                    >
                      Show Details
                    </button>
                    <button
                      onClick={() => {
                        setCreatedRooms(prev => prev.filter(r => r.id !== room.id));
                        toast.success('Room deleted');
                      }}
                      className="text-sm px-4 py-1 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
            {(viewHistory ? joinedRooms : createdRooms).length === 0 && (
              <p className="text-center text-gray-400 col-span-2">
                No {viewHistory ? 'history' : 'created rooms'} found.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          {/* Background effect layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)] z-0" />

          {/* Modal content box */}
          <div className="relative z-10 text-white px-8 py-6 rounded-xl w-full max-w-md text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4">Room Passcode</h2>
            <p className="text-lg mb-6">{selectedPasscode}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>

  );
};

export default Dashboard;
