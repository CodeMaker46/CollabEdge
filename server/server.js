const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const cors = require('cors');
const { USER_CONNECTION_STATUS , User} = require('./types/user');
const { Socket } = require('dgram');


dotenv.config();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);


const io  = new Server(server , {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
})

let userSocketMap = [];

// Function to get All users in a room

const getUsersInRoom = (roomID) =>{
  return userSocketMap.filter((user) => user.roomId === roomID);
}

// Funtion to get Room id by socket id

const getRoomId = (socketId) =>{
  const roomId = userSocketMap.find(
    (user) => user.socketId === socketId
  )?.roomId;

  if (!roomId) {
    console.error("Room ID is undefined for socket ID:", socketId);
    return null;
  }
  return roomId;
}

const getUserBySocketId = (socketId) =>{
  const user = userSocketMap.find((user) => user.socketId === socketId);
  if(!user) {
    console.log("User not found for socket ID: ", socketId);
    return null;
  }
  return user;
}

io.on("connection", (socket)=>{
  // handling user actions

  socket.on(SocketEvent.JOIN_REQUEST, ({roomId, username}) =>{
    const isUserExist = getUsersInRoom(roomId).find((user) => user.username === Username);
    if(isUserExist) {
      socket.emit(SocketEvent.USERNAME_EXISTS);
      return;
    }
    const user = {
      username,
      roomId,
      status: USER_CONNECTION_STATUS.ONLINE,
      cursorPosition: 0,
      typing: false,
      currentFile: null,
      socketId: socket.id,
      currentFile: null,
    };

    userSocketMap.push(user);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit(SocketEvent.USER_JOINED, {user});
    const users  = getUsersInRoom(roomId);
    io.to(socket.id).emit(SocketEvent.JOIN_ACCEPTED, {user, users});

  });


});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);