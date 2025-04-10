const express = require('express');
const router = express.Router();
const Room = require('../models/room');

// Create a new room
router.post('/create', async (req, res) => {
  try {
    const { name, passCode, email } = req.body;

    // Validate required fields
    if (!name || !passCode || !email) {
      return res.status(400).json({ message: 'Name, pass code and email are required' });
    }

    // Check if room with same roomCode exists
    const existingRoom = await Room.findOne({ roomCode });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room with this code already exists' });
    }

    // Create and save the room
    const room = new Room({
      name: roomCode, // Use generated roomCode as the name
      roomCode,
      passCode,
      creator: email
    });
    await room.save();

    res.status(201).json({ room, message: 'Room created successfully' });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Error creating room' });
  }
});

// Join a room
router.post('/join', async (req, res) => {
  try {
    const { roomCode, passCode, email } = req.body;

    // Validate required fields
    if (!roomCode || !passCode || !email) {
      return res.status(400).json({ message: 'Room code, pass code and email are required' });
    }

    // Find room by roomCode
    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Validate passCode
    if (room.passCode !== passCode) {
      return res.status(401).json({ message: 'Invalid pass code' });
    }

    // Add user to active users
    room.addActiveUser(email);
    await room.save();

    res.json({ room, message: 'Successfully joined the room' });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ message: 'Error joining room' });
  }
});

// Get rooms created by a specific user
router.get('/created/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const rooms = await Room.find({ creator: email });
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching user rooms:', error);
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

// Get all rooms (for testing purposes)
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

module.exports = router;