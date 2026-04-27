const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for demo purposes
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_hotel', (hotelId) => {
    socket.join(`hotel_${hotelId}`);
    console.log(`Socket ${socket.id} joined hotel_${hotelId}`);
  });

  socket.on('room_status_update', (data) => {
    // Broadcast to everyone in the same hotel
    io.to(`hotel_${data.hotelId}`).emit('room_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Mock routes for demo (since we are not connecting to a real DB right now unless user sets up PG)
// In a real app, these would be in separate route files and talk to PostgreSQL
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'luxe-secret-key-123';

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // Mock validation
  if (email && password) {
    let role = 'customer';
    if (email.includes('admin')) role = 'admin';
    if (email.includes('staff')) role = 'staff';
    
    const token = jwt.sign({ id: 1, email, role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mock Data
let rooms = [
  { id: 1, hotel_id: 1, room_number: '101', type: 'Single', price: 100, status: 'available' },
  { id: 2, hotel_id: 1, room_number: '102', type: 'Double', price: 150, status: 'booked' },
  { id: 3, hotel_id: 1, room_number: '103', type: 'Suite', price: 250, status: 'cleaning' },
  { id: 4, hotel_id: 1, room_number: '104', type: 'Single', price: 100, status: 'available' },
];

let tasks = [
  { id: 1, hotel_id: 1, room_id: 3, assigned_to: null, task_type: 'cleaning', status: 'pending' },
];

// Routes
app.get('/api/hotels/:hotelId/rooms', (req, res) => {
  const hotelRooms = rooms.filter((r) => r.hotel_id === parseInt(req.params.hotelId));
  res.json(hotelRooms);
});

app.put('/api/rooms/:roomId/status', (req, res) => {
  const { status } = req.body;
  const room = rooms.find((r) => r.id === parseInt(req.params.roomId));
  if (room) {
    room.status = status;
    // Broadcast real-time update
    io.to(`hotel_${room.hotel_id}`).emit('room_updated', room);
    res.json(room);
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

app.get('/api/hotels/:hotelId/tasks', (req, res) => {
  const hotelTasks = tasks.filter((t) => t.hotel_id === parseInt(req.params.hotelId));
  res.json(hotelTasks);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
