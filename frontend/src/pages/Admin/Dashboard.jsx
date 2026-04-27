import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Building, CalendarCheck, Settings, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({ available: 0, booked: 0, cleaning: 0, maintenance: 0 });

  useEffect(() => {
    // Initial Fetch
    axios.get('http://localhost:5000/api/hotels/1/rooms')
      .then(res => {
        setRooms(res.data);
        calculateStats(res.data);
      })
      .catch(err => console.error(err));

    // Socket Setup
    const socket = io('http://localhost:5000');
    socket.emit('join_hotel', 1);

    socket.on('room_updated', (updatedRoom) => {
      setRooms(prev => {
        const newRooms = prev.map(r => r.id === updatedRoom.id ? updatedRoom : r);
        calculateStats(newRooms);
        return newRooms;
      });
    });

    return () => socket.disconnect();
  }, []);

  const calculateStats = (data) => {
    const s = { available: 0, booked: 0, cleaning: 0, maintenance: 0 };
    data.forEach(r => {
      if (s[r.status] !== undefined) s[r.status]++;
    });
    setStats(s);
  };

  const updateRoomStatus = (roomId, newStatus) => {
    axios.put(`http://localhost:5000/api/rooms/${roomId}/status`, { status: newStatus })
      .catch(err => console.error(err));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'booked': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cleaning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col h-full">
        <h2 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-6">Management</h2>
        <nav className="space-y-2 flex-1">
          <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-medium">
            <Activity className="w-5 h-5" />
            <span>Overview</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
            <Building className="w-5 h-5" />
            <span>Rooms</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
            <CalendarCheck className="w-5 h-5" />
            <span>Bookings</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
            <Users className="w-5 h-5" />
            <span>Staff</span>
          </a>
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-200">
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500">Real-time status of your property</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            Generate Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Available', value: stats.available, color: 'text-emerald-600' },
            { label: 'Booked', value: stats.booked, color: 'text-blue-600' },
            { label: 'Cleaning', value: stats.cleaning, color: 'text-amber-600' },
            { label: 'Maintenance', value: stats.maintenance, color: 'text-red-600' }
          ].map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
            >
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Room Management */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Room Status</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500">Room Number</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500">Type</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500">Price</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{room.room_number}</td>
                    <td className="px-6 py-4 text-slate-600">{room.type}</td>
                    <td className="px-6 py-4 text-slate-600">${room.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(room.status)}`}>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={room.status}
                        onChange={(e) => updateRoomStatus(room.id, e.target.value)}
                        className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="available">Set Available</option>
                        <option value="booked">Set Booked</option>
                        <option value="cleaning">Set Cleaning</option>
                        <option value="maintenance">Set Maintenance</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
