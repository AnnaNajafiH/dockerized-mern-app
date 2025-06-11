# Dockerized MERN Stack Application

A complete, production-ready MERN stack application (MongoDB, Express, React, Node.js) containerized with Docker. This application demonstrates how to build and connect frontend, backend, and database components using Docker Compose.

## 📋 Features

- **Containerized Architecture**: All components run in Docker containers
- **MongoDB Database**: NoSQL database for flexible data storage
- **Express.js Backend**: RESTful API with proper error handling
- **React Frontend**: Modern React application built with Vite
- **Nginx**: Production-grade web server for the frontend
- **Container Networking**: Properly configured network communication
- **Volume Persistence**: MongoDB data persists across container restarts
- **Health Checks**: Container health monitoring

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │
│   React     │──────►   Express   │──────►   MongoDB   │
│  Frontend   │      │   Backend   │      │  Database   │
│             │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
    Port 3000           Port 5000           Port 27017
```

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) (Docker Desktop recommended)
- [Docker Compose](https://docs.docker.com/compose/install/) (included in Docker Desktop)
- [Git](https://git-scm.com/downloads)

### Installation

1. Clone the repository
   ```bash
   git clone git@github.com:AnnaNajafiH/dockerized-mern-app.git
   cd dockerized-mern-app
   ```

2. Start the application
   ```bash
   docker-compose up 
   ```

   Or run in detached mode:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Stopping the Application

```bash
docker-compose down
```

## 📁 Project Structure

```
docker-compose.yml       # Docker Compose configuration
backend/                 # Node.js Express backend
  ├── controllers/       # Route controllers
  ├── database/          # Database connection
  ├── models/            # MongoDB models
  ├── routes/            # API routes
  ├── Dockerfile         # Backend container configuration
  └── server.js          # Entry point
frontend/                # React frontend
  ├── frontend/          # React application code
  │   ├── src/           # React source code
  │   │   ├── components/  # React components
  │   │   ├── context/     # React context (state management)
  │   │   └── services/    # API services
  │   └── vite.config.js # Vite configuration
  ├── Dockerfile         # Frontend container configuration
  └── nginx.conf         # Nginx web server configuration
```

## 🔧 API Endpoints

| Method | Endpoint      | Description           |
|--------|---------------|-----------------------|
| GET    | /api/items    | Get all items         |
| GET    | /api/items/:id | Get item by ID        |
| POST   | /api/items    | Create a new item     |
| PUT    | /api/items/:id | Update an item by ID  |
| DELETE | /api/items/:id | Delete an item by ID  |

## 🔄 Development Workflow

### Rebuilding Containers

If you make changes to the code, you'll need to rebuild the containers:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Viewing Logs

```bash
# All containers
docker-compose logs -f

# Specific container
docker-compose logs -f backend
```

### Accessing MongoDB

```bash
docker exec -it mongodb mongosh
```

## ⚙️ Configuration

Environment variables can be configured in the `docker-compose.yml` file:

### Backend Environment Variables
- `PORT`: Backend server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `NODE_ENV`: Environment mode (development/production)

### Frontend Environment Variables
- `VITE_API_URL`: URL for the backend API




