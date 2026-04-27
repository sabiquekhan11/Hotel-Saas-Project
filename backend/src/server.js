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

// Mock Data
let users = [
  { id: 1, email: 'admin@luxestay.com', password: 'password', role: 'admin', name: 'Admin User' },
  { id: 2, email: 'staff@luxestay.com', password: 'password', role: 'staff', name: 'Staff User', phone: '1234567890', staffId: 'STAFF-STAFF-001' }
];

let hotels = [
  { id: 1, name: 'LuxeStay Central', location: 'New York, NY', rate: 200, rooms_count: 50, image: 'hotel1.jpg', owner_id: 1 }
];

let rooms = [
  { id: 1, hotel_id: 1, room_number: '101', type: 'Single', price: 100, status: 'available' },
  { id: 2, hotel_id: 1, room_number: '102', type: 'Double', price: 150, status: 'booked' },
  { id: 3, hotel_id: 1, room_number: '103', type: 'Suite', price: 250, status: 'cleaning' },
  { id: 4, hotel_id: 1, room_number: '104', type: 'Single', price: 100, status: 'available' },
];

let tasks = [
  { id: 1, hotel_id: 1, room_id: 3, assigned_to: null, task_type: 'cleaning', status: 'pending' },
];

// Auth Routes
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'luxe-secret-key-123';

app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  // Use email or staffId for login
  const user = users.find(u => (u.email === email || u.staffId === email) && u.password === password && u.role === role);
  
  if (user) {
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, name: user.name });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/register/hotel', (req, res) => {
  const { adminName, email, password, hotelName, location, rate, roomsCount, image } = req.body;
  
  const newUser = {
    id: users.length + 1,
    name: adminName,
    email,
    password, // In reality, hash this
    role: 'admin'
  };
  users.push(newUser);

  const newHotel = {
    id: hotels.length + 1,
    name: hotelName,
    location,
    rate,
    rooms_count: roomsCount,
    image,
    owner_id: newUser.id
  };
  hotels.push(newHotel);
  
  res.json({ message: 'Hotel registered successfully', hotel: newHotel });
});

// Staff Routes
app.post('/api/staff', (req, res) => {
  const { name, phone } = req.body;
  const staffId = `STAFF-${name.toUpperCase().replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Generate a random 6 character password
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const newStaff = {
    id: users.length + 1,
    name,
    phone,
    staffId,
    email: `${staffId.toLowerCase()}@luxestay.com`,
    password, 
    role: 'staff'
  };
  
  users.push(newStaff);
  res.json({ message: 'Staff added successfully', staff: newStaff });
});

app.get('/api/staff', (req, res) => {
  res.json(users.filter(u => u.role === 'staff'));
});

app.delete('/api/staff/:id', (req, res) => {
  const staffId = parseInt(req.params.id);
  users = users.filter(u => u.id !== staffId);
  res.json({ message: 'Staff terminated successfully' });
});

app.put('/api/staff/password', (req, res) => {
  const { id, newPassword } = req.body;
  const user = users.find(u => u.id === id);
  if (user && user.role === 'staff') {
    user.password = newPassword;
    res.json({ message: 'Password changed successfully' });
  } else {
    res.status(404).json({ error: 'Staff not found' });
  }
});

app.get('/api/hotels', (req, res) => {
  res.json(hotels);
});

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
