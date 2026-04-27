import { motion } from 'framer-motion';
import { Search, Calendar, Users, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CustomerHome() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch available rooms (mocking hotelId 1)
    axios.get('http://localhost:5000/api/hotels/1/rooms')
      .then(res => {
        setRooms(res.data.filter(r => r.status === 'available'));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Experience Unmatched Luxury
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-200 mb-10"
          >
            Discover the perfect getaway with world-class amenities and exceptional service.
          </motion.p>

          {/* Booking Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 items-center"
          >
            <div className="flex-1 flex items-center border border-slate-200 rounded-xl px-4 py-3 w-full">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input type="text" placeholder="Where do you want to go?" className="w-full focus:outline-none text-slate-700" />
            </div>
            <div className="flex-1 flex items-center border border-slate-200 rounded-xl px-4 py-3 w-full">
              <Calendar className="w-5 h-5 text-slate-400 mr-3" />
              <input type="date" className="w-full focus:outline-none text-slate-700 bg-transparent" />
            </div>
            <div className="flex-1 flex items-center border border-slate-200 rounded-xl px-4 py-3 w-full">
              <Users className="w-5 h-5 text-slate-400 mr-3" />
              <select className="w-full focus:outline-none text-slate-700 bg-transparent">
                <option>2 Guests, 1 Room</option>
                <option>3 Guests, 2 Rooms</option>
              </select>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors w-full md:w-auto">
              Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* Available Rooms Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Rooms Available Now</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Book instantly and enjoy a seamless check-in experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.length > 0 ? rooms.map((room, index) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100"
              >
                <div className="h-64 bg-slate-200 relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
                    alt="Room" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-slate-900 flex items-center shadow-sm">
                    <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                    4.9
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{room.type} Room</h3>
                      <p className="text-slate-500 text-sm">Room {room.room_number}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-indigo-600">${room.price}</span>
                      <span className="text-slate-500 text-sm block">/night</span>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors">
                    Book Now
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-3 text-center text-slate-500 py-10">
                No rooms available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
