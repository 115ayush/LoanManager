import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const connectToDatabase = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/loanmanager"; // Fallback to localhost if env variable is not set
        console.log('Connecting to MongoDB:', mongoURI); // Log the connection string

        // Connect to the database without deprecated options
        await mongoose.connect(mongoURI);
        
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit process with failure
    }
};
