#!/bin/sh

# Set up error handling
set -e

# Function to check if MongoDB is ready
check_mongo() {
  nc -z mongo 27017    #mongo must match the Docker Compose service name.
}

# Wait for MongoDB service to be ready
echo "Waiting for MongoDB to be ready..."
timeout=90  # Increased timeout
counter=0
while ! check_mongo; do
  counter=$((counter + 1))
  if [ $counter -eq $timeout ]; then
    echo "Error: Timed out waiting for MongoDB to start. Will retry once more..."
    # Let's try one more time with longer intervals
    counter=0
    timeout=30
    while ! check_mongo; do
      counter=$((counter + 1))
      if [ $counter -eq $timeout ]; then
        echo "Error: Failed to connect to MongoDB after multiple attempts"
        exit 1
      fi
      echo "MongoDB not ready yet. Waiting... (second attempt $counter/$timeout)"
      sleep 2
    done
    break
  fi
  echo "MongoDB not ready yet. Waiting... ($counter/$timeout)"
  sleep 1
done
echo "MongoDB is ready, starting the Node.js application"

# Check for node_modules and install if missing
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
  echo "Installing dependencies..."
  npm ci --production
fi

# Ensure appropriate permissions
chmod -R 755 .

# Start the Node.js application with memory settings
# --max-old-space-size=512 to limit memory usage and prevent container termination
exec node --max-old-space-size=512 server.js
