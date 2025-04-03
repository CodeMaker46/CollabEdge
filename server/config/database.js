const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error('MongoDB URI not defined in .env file');
        }

        const connection = mongoose.connect(mongoURI)
        
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.error(`Error message: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;