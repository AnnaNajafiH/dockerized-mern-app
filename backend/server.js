import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectWithRetry, closeConnection } from './database/database.js';
import itemRouter from './routes/itemRouter.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'http://frontend'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

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
      
      // Then close the database connection using the imported function
      closeConnection()
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

// Initialize application
const init = async () => {
  const dbConnected = await connectWithRetry();
  if (dbConnected) {
    startServer();
  } else {
    process.exit(1);
  }
};

// Start the application
init();