import React from 'react';
import { Code2, Plus, LogIn } from 'lucide-react';
import { CardSpotlight } from '../ui/card-spotlight';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user'); // ✅ Clear user
      toast.success('Signed out successfully!');
      navigate('/'); // or to /login
    } catch (error) {
      console.log(error)
      toast.error('Error signing out');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="container mx-auto px-6 py-8 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="w-8 h-8" />
            <span className="text-xl font-bold">CollabEdge</span>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-white/10 text-white px-6 py-2 rounded-full font-medium hover:bg-white/20 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Room Options */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Start Collaborating
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <CardSpotlight className="p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
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
          </CardSpotlight>

          <CardSpotlight className="p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
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
          </CardSpotlight>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;