const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true
  },
  passCode: {
    type: String,
    required: true
  },
  creator: {
    type: String,  // Store creator's email
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  activeUsers: [{
    email: String,
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Add method to check if user is room creator
roomSchema.methods.isCreator = function(userEmail) {
  return this.creator === userEmail;
};

// Add method to add active user
roomSchema.methods.addActiveUser = function(userEmail) {
  if (!this.activeUsers.find(user => user.email === userEmail)) {
    this.activeUsers.push({ email: userEmail });
  }
};

// Add method to remove active user
roomSchema.methods.removeActiveUser = function(userEmail) {
  this.activeUsers = this.activeUsers.filter(user => user.email !== userEmail);
};

module.exports = mongoose.model('Room', roomSchema);