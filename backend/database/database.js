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
        serverSelectionTimeoutMS: 5000, // Wait only 5 seconds to find the database server.
        socketTimeoutMS: 45000, // If the database stops responding for 45 seconds, close the connection(sockets).
        useNewUrlParser: true,   // Use the newer and better way to read the MongoDB connection string (URL).
        useUnifiedTopology: true,  //Use MongoDB's new connection engine.
        heartbeatFrequencyMS: 10000, // Every 10 seconds, check if the database connection is still alive.
        family: 4, // Only use IPv4 (like 192.168.1.1), skip IPv6 to connect to the database and avoid issues
  
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