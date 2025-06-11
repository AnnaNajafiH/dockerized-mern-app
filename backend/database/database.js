import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        // Add more robust connection options
        useNewUrlParser: true,
        useUnifiedTopology: true,
        heartbeatFrequencyMS: 10000, // Check connection status every 10 seconds
        family: 4, // Use IPv4, skip IPv6 to avoid issues
      });
      console.log('MongoDB connected successfully');
      return true;
    } catch (err) {
      retries += 1;
      console.log(`MongoDB connection attempt ${retries} failed: ${err.message}`);
      // Wait for backoff time before next try
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.error('Could not connect to MongoDB after multiple retries');
  return false;
};

// Function to close database connection
const closeConnection = () => {
  return mongoose.connection.close(false);
};

export { connectWithRetry, closeConnection };