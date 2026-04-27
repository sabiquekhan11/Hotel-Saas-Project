import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Building, CalendarCheck, Settings, Activity, Plus, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]);
  const [stats, setStats] = useState({ available: 0, booked: 0, cleaning: 0, maintenance: 0 });
  const [activeTab, setActiveTab] = useState('overview'); // overview, staff

  // New Staff Form
  const [newStaff, setNewStaff] = useState({ name: '', phone: '' });

  useEffect(() => {
    // Initial Fetch
    axios.get('http://localhost:5000/api/hotels/1/rooms')
      .then(res => {
        setRooms(res.data);
        calculateStats(res.data);
      })
      .catch(err => console.error(err));

    fetchStaff();

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

  const fetchStaff = () => {
    axios.get('http://localhost:5000/api/staff')
      .then(res => setStaff(res.data))
      .catch(err => console.error(err));
  };

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

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/staff', newStaff);
      setNewStaff({ name: '', phone: '' });
      fetchStaff();
      alert(`Staff added successfully!\n\nID: ${res.data.staff.staffId}\nPassword: ${res.data.staff.password}\n\nPlease share this password with the staff member securely.`);
    } catch (err) {
      alert('Error adding staff');
    }
  };

  const handleTerminateStaff = async (id) => {
    if (window.confirm("Are you sure you want to terminate this staff member? This cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/staff/${id}`);
        fetchStaff();
      } catch (err) {
        alert('Error terminating staff');
      }
    }
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
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Activity className="w-5 h-5" />
            <span>Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'staff' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Users className="w-5 h-5" />
            <span>Staff</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500">Real-time status of your property</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Available', value: stats.available, color: 'text-emerald-600' },
                { label: 'Booked', value: stats.booked, color: 'text-blue-600' },
                { label: 'Cleaning', value: stats.cleaning, color: 'text-amber-600' },
                { label: 'Maintenance', value: stats.maintenance, color: 'text-red-600' }
              ].map((stat, idx) => (
                <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

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
                      <th className="px-6 py-4 text-sm font-semibold text-slate-500">Status</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map(room => (
                      <tr key={room.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{room.room_number}</td>
                        <td className="px-6 py-4 text-slate-600">{room.type}</td>
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
          </motion.div>
        )}

        {activeTab === 'staff' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
                <p className="text-slate-500">Add and manage hotel employees</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Add Staff Form */}
              <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                <div className="flex items-center space-x-2 mb-6">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900">Add New Staff</h3>
                </div>
                <form onSubmit={handleAddStaff} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" required value={newStaff.name} 
                      onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" 
                      placeholder="Jane Doe" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" required value={newStaff.phone} 
                      onChange={e => setNewStaff({...newStaff, phone: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" 
                      placeholder="+1 (555) 000-0000" 
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors">
                    Add Staff Member
                  </button>
                </form>
              </div>

              {/* Staff List */}
              <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-900">Current Staff</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-6 py-4 text-sm font-semibold text-slate-500">Name</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-500">Phone</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-500">Staff ID (Login)</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map(s => (
                        <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-medium text-slate-900">{s.name}</td>
                          <td className="px-6 py-4 text-slate-600">{s.phone}</td>
                          <td className="px-6 py-4">
                            <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">{s.staffId}</code>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleTerminateStaff(s.id)}
                              className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg"
                            >
                              Terminate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {staff.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No staff members added yet.</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
