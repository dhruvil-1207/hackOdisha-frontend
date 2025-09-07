# Student Rooms Application

A full-stack application for student collaboration with real-time features.

## Architecture

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Go with GoFr framework
- **Database**: PostgreSQL (Supabase)
- **Real-time**: WebSocket for live updates

## Prerequisites

- Node.js (v16 or higher)
- Go (v1.24 or higher)
- Git

## Quick Start

### Option 1: Using Batch Script (Windows)
```bash
# Run the batch script to start all servers
start-dev.bat
```

### Option 2: Using PowerShell Script (Windows)
```powershell
# Run the PowerShell script to start all servers
.\start-dev.ps1
```

### Option 3: Manual Setup

1. **Start Backend Server**:
   ```bash
   cd student-rooms-backend
   go run cmd/server/main.go
   ```

2. **Start WebSocket Server** (in a new terminal):
   ```bash
   cd student-rooms-backend
   go run cmd/websocket/main.go
   ```

3. **Start Frontend Server** (in a new terminal):
   ```bash
   cd student-rooms-frontend
   npm install
   npm start
   ```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **WebSocket**: ws://localhost:8001

## Environment Configuration

### Backend (.env)
```
SUPABASE_DB_URL=your-database-url
JWT_SECRET=your-jwt-secret
PORT=8000
WEBSOCKET_URL=ws://localhost:8001/ws
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_WEBSOCKET_URL=ws://localhost:8001/ws
```

## Features

- User authentication (signup/login)
- Room creation and management
- Real-time messaging and notifications
- File uploads
- Comments and doubts system
- Online user tracking

## API Endpoints

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /rooms` - Get all rooms
- `POST /rooms` - Create new room
- `GET /rooms/:roomId/posts` - Get room posts
- `POST /rooms/:roomId/posts` - Create new post
- `GET /comments/:parentId` - Get comments
- `POST /comments` - Create comment
- `GET /rooms/:roomId/doubts` - Get room doubts
- `POST /rooms/:roomId/doubts` - Create doubt

## Development

The application uses CORS to allow frontend-backend communication. The backend is configured to accept requests from `http://localhost:3000`.

## Troubleshooting

1. **Port conflicts**: Make sure ports 3000, 8000, and 8001 are available
2. **Database connection**: Verify your Supabase credentials in the backend `.env` file
3. **CORS issues**: Ensure the frontend is running on `http://localhost:3000`
4. **WebSocket connection**: Check that the WebSocket server is running on port 8001
