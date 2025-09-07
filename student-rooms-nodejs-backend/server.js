const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Mock Database (In-Memory)
const mockDB = {
  users: [
    {
      id: '1',
      email: 'test@example.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      name: 'Test User',
      createdAt: new Date().toISOString()
    }
  ],
  rooms: [
    {
      id: '1',
      name: 'General Discussion',
      description: 'A room for general discussions',
      createdBy: '1',
      createdAt: new Date().toISOString(),
      members: ['1']
    },
    {
      id: '2',
      name: 'Study Group',
      description: 'Study together and share resources',
      createdBy: '1',
      createdAt: new Date().toISOString(),
      members: ['1']
    }
  ],
  posts: [
    {
      id: '1',
      title: 'Welcome to the room!',
      content: 'This is the first post in this room.',
      roomId: '1',
      authorId: '1',
      createdAt: new Date().toISOString()
    }
  ],
  comments: [],
  doubts: []
};

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Student Rooms Backend is running!' });
});

// Auth routes
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = mockDB.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString()
    };

    mockDB.users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = mockDB.users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
app.get('/auth/me', authenticateToken, (req, res) => {
  try {
    const user = mockDB.users.find(user => user.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Rooms routes
app.get('/rooms', authenticateToken, (req, res) => {
  res.json(mockDB.rooms);
});

app.post('/rooms', authenticateToken, (req, res) => {
  try {
    const { name, description } = req.body;
    
    const newRoom = {
      id: uuidv4(),
      name,
      description,
      createdBy: req.user.userId,
      createdAt: new Date().toISOString(),
      members: [req.user.userId]
    };

    mockDB.rooms.push(newRoom);
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Posts routes
app.get('/rooms/:roomId/posts', authenticateToken, (req, res) => {
  const { roomId } = req.params;
  const posts = mockDB.posts.filter(post => post.roomId === roomId);
  res.json(posts);
});

app.post('/rooms/:roomId/posts', authenticateToken, (req, res) => {
  try {
    const { roomId } = req.params;
    const { title, content } = req.body;

    const newPost = {
      id: uuidv4(),
      title,
      content,
      roomId,
      authorId: req.user.userId,
      createdAt: new Date().toISOString()
    };

    mockDB.posts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Notes routes (alias for posts)
app.get('/rooms/:roomId/notes', authenticateToken, (req, res) => {
  const { roomId } = req.params;
  const posts = mockDB.posts.filter(post => post.roomId === roomId);
  res.json(posts);
});

app.post('/rooms/:roomId/notes', authenticateToken, (req, res) => {
  try {
    const { roomId } = req.params;
    const { title, content } = req.body;

    const newPost = {
      id: uuidv4(),
      title,
      content,
      roomId,
      authorId: req.user.userId,
      createdAt: new Date().toISOString()
    };

    mockDB.posts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Comments routes
app.get('/comments/:parentId', authenticateToken, (req, res) => {
  const { parentId } = req.params;
  const comments = mockDB.comments.filter(comment => comment.parentId === parentId);
  res.json(comments);
});

app.post('/comments', authenticateToken, (req, res) => {
  try {
    const { content, parentId, parentType } = req.body;

    const newComment = {
      id: uuidv4(),
      content,
      parentId,
      parentType,
      authorId: req.user.userId,
      createdAt: new Date().toISOString()
    };

    mockDB.comments.push(newComment);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Doubts routes
app.get('/rooms/:roomId/doubts', authenticateToken, (req, res) => {
  const { roomId } = req.params;
  const doubts = mockDB.doubts.filter(doubt => doubt.roomId === roomId);
  res.json(doubts);
});

app.post('/rooms/:roomId/doubts', authenticateToken, (req, res) => {
  try {
    const { roomId } = req.params;
    const { title, description } = req.body;

    const newDoubt = {
      id: uuidv4(),
      title,
      description,
      roomId,
      authorId: req.user.userId,
      createdAt: new Date().toISOString(),
      status: 'open'
    };

    mockDB.doubts.push(newDoubt);
    res.status(201).json(newDoubt);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// File upload routes (mock)
app.post('/upload', authenticateToken, (req, res) => {
  res.json({ message: 'File upload endpoint - not implemented in mock version' });
});

app.post('/upload/multiple', authenticateToken, (req, res) => {
  res.json({ message: 'Multiple file upload endpoint - not implemented in mock version' });
});

app.get('/files/:fileId', authenticateToken, (req, res) => {
  res.json({ message: 'File info endpoint - not implemented in mock version' });
});

// WebSocket info
app.get('/ws-info', (req, res) => {
  res.json({
    websocket_url: 'ws://localhost:8001/ws',
    status: 'WebSocket server running',
    test_client: '/static/websocket_client.html'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}`);
});

// WebSocket Server
const wss = new WebSocket.Server({ port: 8001 });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      
      // Echo back the message for now
      ws.send(JSON.stringify({
        type: 'echo',
        data: data,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

console.log('WebSocket server running on port 8001');
