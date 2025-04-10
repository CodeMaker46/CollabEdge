const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/database');
const roomRoutes = require('./routes/room');
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user');

const app = express();
dotenv.config();
connectDB();


// CORS middleware with permissive settings for Instagram
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600
}));


app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Server is running...');
})

// Routes 
app.use('/api/rooms', roomRoutes);
// app.use('/api/auth', authRoutes);

module.exports = app;