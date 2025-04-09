const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const cors = require('cors');
const { USER_CONNECTION_STATUS } = require('./types/user');


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

let userSocketMap = []; // this is array of users (object) connected to the server



const getUsersInRoom = (roomID) =>{
  return userSocketMap.filter((user) => user.roomId === roomID);
}



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
  // io connection start

  // user logic

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


  socket.on("disconecting", ()=>{
    const user = getUserBySocketId(socket.id);
    if(!user) return;
    const roomId = user.roomId;

    socket.broadcast
      .to(roomId)
      .emit(SocketEvent.USER_DISCONNECTED, {user: {...user, status: USER_CONNECTION_STATUS.OFFLINE}});
    userSocketMap = userSocketMap.filter((u) => u.socketId !== socket.id);
    socket.leave(roomId);
  })



  // file logic

  socket.on(
    SocketEvent.SYNC_FILE_STRUCTURE,

    ({fileStructure, openFiles, activeFiles, socketId}) =>{
      io.to(socketId).emit(SocketEvent.SYNC_FILE_STRUCTURE, {
        fileStructure,
        openFiles,
        activeFiles,
      });
    }
  )


  socket.on(
    SocketEvent.DIRECTORY_CREATED,
    ({parentDirId, newDirectory}) =>{
      const roomId = getRoomId(socketId);
      socket.broadcast.to(roomId).emit(SocketEvent.DIRECTORY_CREATED,
         {parentDirId, newDirectory});
    }
  )


  socket.on(SocketEvent.DIRECTORY_RENAMED, ({ dirId, newName }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.DIRECTORY_RENAMED, {
			dirId,
			newName,
		})
	})


  socket.on(SocketEvent.DIRECTORY_DELETED, ({ dirId }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.DIRECTORY_DELETED, { dirId })
	})

  socket.on(SocketEvent.FILE_CREATED, ({ parentDirId, newFile }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.FILE_CREATED, { parentDirId, newFile })
	})

	socket.on(SocketEvent.FILE_UPDATED, ({ fileId, newContent }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.FILE_UPDATED, {
			fileId,
			newContent,
		})
	})

	socket.on(SocketEvent.FILE_RENAMED, ({ fileId, newName }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.FILE_RENAMED, {
			fileId,
			newName,
		})
	})

	socket.on(SocketEvent.FILE_DELETED, ({ fileId }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.FILE_DELETED, { fileId })
	})


  // user status logic

  socket.on(SocketEvent.USER_OFFLINE, ({ socketId }) => {
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socketId) {
        return { ...user, status: USER_CONNECTION_STATUS.OFFLINE };
      }
      return user;
    });
    const roomId = getRoomId(socketId); 
    if (roomId) {
      socket.broadcast.to(roomId).emit(SocketEvent.USER_OFFLINE, { socketId });
    }
  })

  socket.on(SocketEvent.USER_ONLINE, ({ socketId }) => {
		userSocketMap = userSocketMap.map((user) => {
			if (user.socketId === socketId) {
				return { ...user, status: USER_CONNECTION_STATUS.ONLINE }
			}
			return user
		})
		const roomId = getRoomId(socketId)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.USER_ONLINE, { socketId })
	})

  // chat logic


  socket.on(SocketEvent.SEND_MESSAGE, ({ message }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.RECEIVE_MESSAGE, { message })
	})


  // curson position logic

  socket.on(SocketEvent.CURSOR_POSITION,({ cusorPosition}) =>{
    userSocketMap = userSocketMap.map((user) => {
      if (user.socketId === socket.id) {
        return { ...user,typing : true, cursorPosition };
      }
      return user;
    });

    const user  = getUserBySocketId(socket.id);
    if(!user) return;
    const roomId = user.roomId;
    socket.broadcast.to(roomId).emit(SocketEvent.CURSOR_POSITION, {
      user: { ...user, typing: true },
      cursorPosition,
    });
  })

  socket.on(SocketEvent.TYPING_PAUSE, () => {
		userSocketMap = userSocketMap.map((user) => {
			if (user.socketId === socket.id) {
				return { ...user, typing: false }
			}
			return user
		})
		const user = getUserBySocketId(socket.id)
		if (!user) return
		const roomId = user.roomId
		socket.broadcast.to(roomId).emit(SocketEvent.TYPING_PAUSE, { user })
	})

  // while drawing logic


  socket.on(SocketEvent.REQUEST_DRAWING, () => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.REQUEST_DRAWING, { socketId: socket.id })
	})


  socket.on(SocketEvent.SYNC_DRAWING, ({ drawingData, socketId }) => {
		socket.broadcast
			.to(socketId)
			.emit(SocketEvent.SYNC_DRAWING, { drawingData })
	})


  socket.on(SocketEvent.DRAWING_UPDATE, ({ snapshot }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.DRAWING_UPDATE, {
			snapshot,
		})
	})






  // io connection endpoint


});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);