import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Upload, Building, User, Mail, Lock, DollarSign, Hash } from 'lucide-react';
import axios from 'axios';

export default function RegisterAdmin() {
  const [formData, setFormData] = useState({
    adminName: '', email: '', password: '', hotelName: '', location: '', rate: '', roomsCount: '', image: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register/hotel', formData);
      alert('Hotel Registered Successfully! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Error registering hotel');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Partner with LuxeStay</h1>
          <p className="text-slate-500 text-lg">Register your hotel and reach thousands of guests.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Map / Image Section */}
            <div className="w-full md:w-5/12 bg-slate-900 relative p-8 flex flex-col justify-between text-white">
              <div className="absolute inset-0 opacity-40">
                <img src="https://images.unsplash.com/photo-1542314831-c6a4d14d8373?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Hotel" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <Building className="w-12 h-12 mb-4 text-indigo-400" />
                <h2 className="text-2xl font-bold mb-2">Grow Your Business</h2>
                <p className="text-slate-300">Join our network of premium properties and manage your bookings seamlessly.</p>
              </div>
              
              {/* Mock Google Maps Embed */}
              <div className="relative z-10 mt-8 rounded-xl overflow-hidden border-2 border-white/20 h-48 bg-slate-800">
                 {formData.location ? (
                    <iframe 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${encodeURIComponent(formData.location)}`}
                    ></iframe>
                 ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 flex-col">
                      <MapPin className="w-8 h-8 mb-2" />
                      <span className="text-sm">Location Preview</span>
                    </div>
                 )}
              </div>
            </div>

            {/* Form Section */}
            <div className="w-full md:w-7/12 p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">Admin Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input type="text" name="adminName" required onChange={handleChange} className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" placeholder="John Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input type="email" name="email" required onChange={handleChange} className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" placeholder="admin@hotel.com" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <input type="password" name="password" required onChange={handleChange} className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mt-8 mb-6">Hotel Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hotel Name</label>
                  <div className="relative">
                    <Building className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <input type="text" name="hotelName" required onChange={handleChange} className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" placeholder="Luxe Resort & Spa" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location (Address)</label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <input type="text" name="location" required onChange={handleChange} className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" placeholder="123 Ocean Drive, Miami, FL" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">This will update the map preview automatically.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Rooms</label>
                    <div className="relative">
                      <Hash className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input type="number" name="roomsCount" required onChange={handleChange} className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" placeholder="50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Avg Rate per Night ($)</label>
                    <div className="relative">
                      <DollarSign className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input type="number" name="rate" required onChange={handleChange} className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" placeholder="200" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hotel Image URL</label>
                  <div className="relative">
                    <Upload className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <input type="url" name="image" required onChange={handleChange} className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" placeholder="https://images.unsplash.com/photo-..." />
                  </div>
                </div>

                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors mt-4 shadow-lg shadow-slate-900/20">
                  Register Hotel
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
