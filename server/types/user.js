const USER_CONNECTION_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
};

/**
 * @typedef {Object} User
 * @property {string} username
 * @property {string} roomId
 * @property {"offline" | "online"} status
 * @property {number} cursorPosition
 * @property {boolean} typing
 * @property {string|null} currentFile
 * @property {string} socketId
 */


export {USER_CONNECTION_STATUS,User}
