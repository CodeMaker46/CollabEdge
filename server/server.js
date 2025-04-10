const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const { USER_CONNECTION_STATUS } = require('./types/user');
const Room = require('./models/room');
const { SocketEvent } = require('./types/socket');


dotenv.config();
const server = http.createServer(app);


const io  = new Server(server , {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
})

let userSocketMap = new Map(); // Map to store user socket connections

// Get active users in a room
const getUsersInRoom = async (roomId) => {
  try {
    const room = await Room.findById(roomId);
    return room ? room.activeUsers : [];
  } catch (error) {
    console.error('Error getting users in room:', error);
    return [];
  }
};

// Get user by socket ID
const getUserBySocketId = (socketId) => {
  return userSocketMap.get(socketId);
};

// Generate a unique room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create a new room
const createRoom = async (name, passCode, creatorEmail) => {
  try {
    if (!name || !passCode || !creatorEmail) {
      throw new Error('Name, pass code and creator email are required');
    }
    
    let roomCode = name;
    
    const room = new Room({
      name: roomCode,
      roomCode: roomCode,
      passCode,
      creator: creatorEmail
    });
    await room.save();
    return room;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

// Join a room
const joinRoom = async (roomCode, passCode, userEmail) => {
  try {
    // Find room by roomCode
    const room = await Room.findOne({ roomCode });
    if (!room) {
      throw new Error('Room not found. Please check if the room code is correct.');
    }

    // Validate passCode
    if (room.passCode !== passCode) {
      throw new Error('Invalid pass code. Please check your pass code and try again.');
    }

    // Add user to active users and save
    room.addActiveUser(userEmail);
    await room.save();
    return room;
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Helper function to get room code from socket ID
  const getRoomCode = (socketId) => {
    const user = getUserBySocketId(socketId);
    return user ? user.roomCode : null;
  };

  // Handle editor-specific events
  socket.on('join_editor', ({ roomId }) => {
    socket.join(roomId);
    // Request current content from other users in the room
    socket.to(roomId).emit('request_content');
  });

  socket.on('request_content', () => {
    const roomId = Array.from(socket.rooms)[1]; // Get the room ID (first room is the socket's own room)
    if (roomId) {
      socket.to(roomId).emit('editor_init', { content: '' });
    }
  });

  // Handle content changes with proper room context
  socket.on('content_change', ({ roomId, content, userId }) => {
    if (roomId && content !== undefined) {
      socket.to(roomId).emit('content_updated', {
        newContent: content,
        userId
      });
    }
  });

  // Handle room creation
  socket.on('create_room', async ({ name, passCode, email }) => {
    try {
      if (!name || !passCode || !email) {
        throw new Error('Name, pass code and email are required');
      }
      const room = await createRoom(name, passCode, email);
      userSocketMap.set(socket.id, { email, roomCode: room.roomCode });
      socket.join(room.roomCode);
      socket.emit('room_created', { room });
    } catch (error) {
      socket.emit('room_error', { message: error.message });
    }
  });

  // Handle room joining
  socket.on('join_room', async ({ roomCode, passCode, email }) => {
    try {
      const room = await joinRoom(roomCode, passCode, email);
      userSocketMap.set(socket.id, { email, roomCode });
      socket.join(roomCode);
      
      // Notify all users in room about new user
      io.to(roomCode).emit('user_joined', { 
        email,
        activeUsers: room.activeUsers 
      });
      
      socket.emit('room_joined', { 
        room,
        message: 'Successfully joined the room!'
      });
    } catch (error) {
      socket.emit('room_error', { message: error.message });
    }
  });

  // Handle disconnecting users
  socket.on("disconnecting", () => {
    const user = getUserBySocketId(socket.id);
    if(!user) return;
    const roomCode = user.roomCode;

    socket.broadcast
      .to(roomCode)
      .emit(SocketEvent.USER_DISCONNECTED, {user: {...user, status: USER_CONNECTION_STATUS.OFFLINE}});
    userSocketMap.delete(socket.id);
    socket.leave(roomCode);
  });

  // File logic
  socket.on(SocketEvent.SYNC_FILE_STRUCTURE, ({fileStructure, openFiles, activeFiles, socketId}) => {
    io.to(socketId).emit(SocketEvent.SYNC_FILE_STRUCTURE, {
      fileStructure,
      openFiles,
      activeFiles,
    });
  });

  socket.on(SocketEvent.DIRECTORY_CREATED, ({parentDirId, newDirectory}) => {
    const roomCode = getRoomCode(socket.id);
    if (!roomCode) return;
    socket.broadcast.to(roomCode).emit(SocketEvent.DIRECTORY_CREATED, {parentDirId, newDirectory});
  });

  socket.on(SocketEvent.DIRECTORY_RENAMED, ({ dirId, newName }) => {
    const roomCode = getRoomCode(socket.id);
    if (!roomCode) return;
    socket.broadcast.to(roomCode).emit(SocketEvent.DIRECTORY_RENAMED, {
      dirId,
      newName,
    });
  });

  socket.on(SocketEvent.DIRECTORY_DELETED, ({ dirId }) => {
    const roomCode = getRoomCode(socket.id);
    if (!roomCode) return;
    socket.broadcast.to(roomCode).emit(SocketEvent.DIRECTORY_DELETED, { dirId });
  });

  socket.on(SocketEvent.FILE_CREATED, ({ parentDirId, newFile }) => {
    const roomCode = getRoomCode(socket.id);
    if (!roomCode) return;
    socket.broadcast.to(roomCode).emit(SocketEvent.FILE_CREATED, { parentDirId, newFile });
  });

  socket.on(SocketEvent.FILE_UPDATED, ({ fileId, newContent }) => {
    const roomCode = getRoomCode(socket.id);
    if (!roomCode) return;
    socket.broadcast.to(roomCode).emit(SocketEvent.FILE_UPDATED, {
      fileId,
      newContent,
    });
  });

  socket.on(SocketEvent.FILE_RENAMED, ({ fileId, newName }) => {
    const roomCode = getRoomCode(socket.id);
    if (!roomCode) return;
    socket.broadcast.to(roomCode).emit(SocketEvent.FILE_RENAMED, {
      fileId,
      newName,
    });
  });

  socket.on(SocketEvent.FILE_DELETED, ({ fileId }) => {
    const roomCode = getRoomCode(socket.id);
    if (!roomCode) return;
    socket.broadcast.to(roomCode).emit(SocketEvent.FILE_DELETED, { fileId });
  });

  // User status logic
  // Handle get rooms request
  socket.on('get_rooms', async ({ email }) => {
    try {
      const createdRooms = await Room.find({ creator: email });
      const joinedRooms = await Room.find({
        'activeUsers.email': email,
        creator: { $ne: email }
      });
      
      socket.emit('rooms_data', {
        createdRooms,
        joinedRooms
      });
    } catch (error) {
      socket.emit('room_error', { message: 'Error fetching rooms' });
    }
  });

  socket.on(SocketEvent.USER_OFFLINE, ({ socketId }) => {
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socketId) {
        return { ...user, status: USER_CONNECTION_STATUS.OFFLINE };
      }
      return user;
    });
    const roomCode = getRoomCode(socketId); 
    if (roomCode) {
      socket.broadcast.to(roomCode).emit(SocketEvent.USER_OFFLINE, { socketId });

    }
  });

  socket.on(SocketEvent.USER_ONLINE, ({ socketId }) => {
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socketId) {
        return { ...user, status: USER_CONNECTION_STATUS.ONLINE };
      }
      return user;
    });
    const roomCode = getRoomCode(socket.id);
    if (!roomCode) return;
    socket.broadcast.to(roomCode).emit(SocketEvent.USER_ONLINE, { socketId });
  });

  // Chat logic
  socket.on(SocketEvent.SEND_MESSAGE, ({ message }) => {
    const roomCode = getRoomCode(socket.id);
    if (!roomCode) return;
    socket.broadcast.to(roomCode).emit(SocketEvent.RECEIVE_MESSAGE, { message });
  });

  // Cursor position logic
  socket.on(SocketEvent.CURSOR_POSITION, ({ cursorPosition }) => {
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socket.id) {
        return { ...user, typing: true, cursorPosition };
      }
      return user;
    });

    const user = getUserBySocketId(socket.id);
    if(!user) return;
    const roomId = user.roomId;
    socket.broadcast.to(roomId).emit(SocketEvent.CURSOR_POSITION, {
      user: { ...user, typing: true },
      cursorPosition,
    });
  });

  socket.on(SocketEvent.TYPING_PAUSE, () => {
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socket.id) {
        return { ...user, typing: false };
      }
      return user;
    });
    const user = getUserBySocketId(socket.id);
    if (!user) return;
    const roomId = user.roomId;
    socket.broadcast.to(roomId).emit(SocketEvent.TYPING_PAUSE, { user });
  });

  // Drawing logic
  socket.on(SocketEvent.REQUEST_DRAWING, () => {
    const roomCode = getRoomCode(socket.id);
    if (!roomCode) return;
    socket.broadcast.to(roomCode).emit(SocketEvent.REQUEST_DRAWING, { socketId: socket.id });
  });

  socket.on(SocketEvent.SYNC_DRAWING, ({ drawingData, socketId }) => {
    socket.broadcast.to(socketId).emit(SocketEvent.SYNC_DRAWING, { drawingData });
  });

  socket.on(SocketEvent.DRAWING_UPDATE, ({ snapshot }) => {
    const roomCode = getRoomCode(socket.id);
    if (!roomCode) return;
    socket.broadcast.to(roomCode).emit(SocketEvent.DRAWING_UPDATE, {
      snapshot,
    });
  });
});




const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);