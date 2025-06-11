FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install netcat for the health check script
RUN apk add --no-cache netcat-openbsd

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Make the startup script executable
RUN chmod +x start.sh

# Expose the port the app runs on
EXPOSE 5000

# Health check to make sure the application is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -q -O - http://localhost:5000/ || exit 1

# Command to run the application with the startup script
CMD ["./start.sh"]
