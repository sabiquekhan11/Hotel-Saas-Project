CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer' -- 'customer', 'admin', 'staff'
);

CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id INT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  hotel_id INT REFERENCES hotels(id),
  room_number VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'Single', 'Double', 'Suite'
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'available', -- 'available', 'booked', 'maintenance', 'cleaning'
  features TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  room_id INT REFERENCES rooms(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' -- 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  hotel_id INT REFERENCES hotels(id),
  room_id INT REFERENCES rooms(id),
  assigned_to INT REFERENCES users(id),
  task_type VARCHAR(50) NOT NULL, -- 'cleaning', 'maintenance'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
