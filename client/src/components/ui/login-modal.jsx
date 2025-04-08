import React from 'react';
import { X } from 'lucide-react';
import { signInWithGoogle } from '../../lib/firebase';

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-black border border-white/10 rounded-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Welcome to CollabEdge</h2>
          <p className="text-gray-400 mb-8">
            Join thousands of developers collaborating in real-time
          </p>
          
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;