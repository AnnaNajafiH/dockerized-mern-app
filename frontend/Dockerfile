FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json from frontend subdirectory
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code from frontend subdirectory
COPY frontend/ ./

# Build for production
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]