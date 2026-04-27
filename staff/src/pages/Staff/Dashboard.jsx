import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function StaffDashboard() {
  const [rooms, setRooms] = useState([]);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  useEffect(() => {
    // Initial Fetch
    axios.get('http://localhost:5000/api/hotels/1/rooms')
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));

    // Socket Setup
    const socket = io('http://localhost:5000');
    socket.emit('join_hotel', 1);

    socket.on('room_updated', (updatedRoom) => {
      setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    });

    return () => socket.disconnect();
  }, []);

  const updateRoomStatus = (roomId, newStatus) => {
    axios.put(`http://localhost:5000/api/rooms/${roomId}/status`, { status: newStatus })
      .catch(err => console.error(err));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      // In a real app we decode JWT to get ID. Here we mock it by parsing token or assuming user id 2.
      // Wait, we need the user id. For demo, staff is usually id: 2 in our mock db.
      await axios.put('http://localhost:5000/api/staff/password', { id: 2, newPassword });
      alert('Password changed successfully!');
      setShowPasswordChange(false);
      setNewPassword('');
    } catch (err) {
      alert('Error changing password');
    }
  };

  const tasks = rooms.filter(r => r.status === 'cleaning' || r.status === 'maintenance');

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Staff Portal</h1>
            <p className="text-slate-500">Manage your daily tasks and housekeeping duties.</p>
          </div>
          <button 
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm"
          >
            {showPasswordChange ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordChange && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Change Your Password</h3>
            <form onSubmit={handleChangePassword} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input 
                  type="password" required value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" 
                  placeholder="Enter new password" 
                />
              </div>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors">
                Update
              </button>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Pending Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">Active Tasks</h2>
        
        {tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">Room {task.room_number}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      task.status === 'cleaning' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {task.status === 'cleaning' ? 'Needs Cleaning' : 'Maintenance Required'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> Requested recently
                  </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => updateRoomStatus(task.id, 'available')}
                    className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Completed
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">All caught up!</h3>
            <p className="text-slate-500">There are no pending housekeeping or maintenance tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
}
