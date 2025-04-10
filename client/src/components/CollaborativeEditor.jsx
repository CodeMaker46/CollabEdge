import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const CollaborativeEditor = ({ roomId }) => {
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:3000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Join the room
    if (roomId) {
      socketRef.current.emit('join_editor', { roomId });
    }

    // Listen for content updates from other users
    socketRef.current.on('content_updated', ({ newContent, userId }) => {
      if (userId !== socketRef.current.id) {
        setContent(newContent);
      }
    });

    // Listen for initial content when joining
    socketRef.current.on('editor_init', ({ content: initialContent }) => {
      setContent(initialContent);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('content_updated');
        socketRef.current.off('editor_init');
        socketRef.current.disconnect();
      }
    };
  }, [roomId]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set typing indicator
    setIsTyping(true);

    // Emit content change after a short delay
    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('content_change', {
          roomId,
          content: newContent,
          userId: socketRef.current.id
        });
      }
      setIsTyping(false);
    }, 300);
  };

  return (
    <div className="w-full h-full">
      <textarea
        value={content}
        onChange={handleContentChange}
        className="w-full h-full p-4 bg-white/5 text-white rounded-lg border border-white/20 focus:outline-none focus:border-white/40 resize-none"
        placeholder="Start typing here..."
      />
      {isTyping && (
        <div className="absolute bottom-4 right-4 text-sm text-gray-400">
          Someone is typing...
        </div>
      )}
    </div>
  );
};

export default CollaborativeEditor;