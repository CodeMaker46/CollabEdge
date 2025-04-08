
const SocketEvent = {
    JOIN_REQUEST: 'join-request',
    JOIN_ACCEPTED: 'join-accepted',
    USER_JOINED: 'user-joined',
    USER_DISCONNECTED: 'user-disconnected',
    SYNC_FILE_STRUCTURE: 'sync-file-structure',
    DIRECTORY_CREATED: 'directory-created',
    DIRECTORY_UPDATED: 'directory-updated',
    DIRECTORY_RENAMED: 'directory-renamed',
    DIRECTORY_DELETED: 'directory-deleted',
    FILE_CREATED: 'file-created',
    FILE_UPDATED: 'file-updated',
    FILE_RENAMED: 'file-renamed',
    FILE_DELETED: 'file-deleted',
    USER_OFFLINE: 'user-offline',
    USER_ONLINE: 'user-online',
    SEND_MESSAGE: 'send-message',
    RECEIVE_MESSAGE: 'receive-message',
    TYPING_START: 'typing-start',
    TYPIND_PAUSE: 'typing-pause',
    USERNAME_EXISTS: 'username-exists',
    REQUEST_DRAWING: 'request-drawing',
    SYNC_DRAWING: 'sync-drawing',
    DRAWING_UPDATE: 'drawing-update',
}

const SocketContext = {
    socket: null, // This will hold the actual socket instance later
}

module.exports = {
    SocketEvent,
    SocketContext,
  };
