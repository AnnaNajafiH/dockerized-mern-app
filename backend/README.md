# Mini REST API Backend

This is a Node.js Express backend application that provides a RESTful API for managing items in a MongoDB database. It's built with modern practices and designed to run in a Docker container.

## Features

- RESTful API endpoints for CRUD operations on items
- MongoDB database integration with Mongoose
- Docker containerization
- Error handling and graceful shutdown
- CORS configuration
- Environment variable support
- Connection retry logic for database

## Directory Structure
backend/
├── controllers/         
│   └── itemControllers.js
├── database/           
│   └── database.js
├── models/             
│   └── itemModel.js
├── routes/             
│   └── itemRouter.js
├── .dockerignore       
├── .env                
├── .gitignore         
├── Dockerfile         
├── package.json       
├── server.js           
└── start.sh            


## API Endpoints

| Method | Endpoint      | Description           |
|--------|---------------|-----------------------|
| GET    | /api/items    | Get all items         |
| GET    | /api/items/:id | Get item by ID        |
| POST   | /api/items    | Create a new item     |
| PUT    | /api/items/:id | Update an item by ID  |
| DELETE | /api/items/:id | Delete an item by ID  |

## Installation

### Prerequisites

- Node.js v18 or higher
- MongoDB
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. Clone the repository
2. Install dependencies:


### Docker Deployment

The application is designed to be run in Docker containers using Docker Compose:

```bash
# Build and start containers
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop containers
docker-compose down