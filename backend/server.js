import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRouter from './routes/itemRouter.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
// Configure CORS to allow requests from the React frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://frontend'], // React frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

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
      // Explicitly start server after successful connection
      startServer();
      return;
    } catch (err) {
      retries += 1;
      console.log(`MongoDB connection attempt ${retries} failed: ${err.message}`);
      // Wait for backoff time before next try
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.error('Could not connect to MongoDB after multiple retries');
  process.exit(1);
};



// API Routes
app.use('/api/items', itemRouter);



// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Mini REST API with Express, React, and MongoDB');
});

// Start server after MongoDB connection is established
const startServer = () => {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Handle server level errors
  server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Trying again in 10 seconds...`);
      setTimeout(() => {
        server.close();
        server.listen(PORT);
      }, 10000);
    }
  });

  // Handle process termination gracefully
  const gracefulShutdown = (signal) => {
    console.log(`Received ${signal} signal, closing connections...`);
    
    // Set a timeout for the entire shutdown process
    const forceExitTimeout = setTimeout(() => {
      console.log('Forcing server shutdown after timeout...');
      process.exit(1);
    }, 15000);
    
    // Close the server first
    server.close(() => {
      console.log('HTTP server closed');
      
      // Then close the database connection
      mongoose.connection.close(false)
        .then(() => {
          console.log('MongoDB connection closed');
          clearTimeout(forceExitTimeout);
          process.exit(0);
        })
        .catch(err => {
          console.error('Error closing MongoDB connection:', err);
          clearTimeout(forceExitTimeout);
          process.exit(1);
        });
    });
  };

  // Handle termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  // Handle uncaught exceptions to prevent container crash
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    // Keep the process running but log the error
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason);
  });
};

// Start MongoDB connection and then the server
connectWithRetry();
