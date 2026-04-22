import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users,
  Plus,
  Clock,
  Zap,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get('/events');
      setEvents(res.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRSVP = async (eventId) => {
    try {
      await API.post(`/events/${eventId}/rsvp`);
      fetchEvents();
    } catch (error) {
      console.error('Failed to RSVP', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-10"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Global Meetups</h1>
          <p className="text-gray-500 mt-1">Networking summits, tech workshops, and alumni reunions.</p>
        </div>
        {user?.role === 'Admin' && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 font-bold"
          >
            <Plus size={20} />
            <span>Host Summit</span>
          </motion.button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="h-80 bg-white saas-card animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="saas-card bg-white/50 border-dashed border-2 border-gray-200 p-20 text-center">
          <Calendar size={48} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-800">The calendar is clear</h3>
          <p className="text-gray-400 mt-2 max-w-xs mx-auto">Check back shortly for exclusive community gatherings.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence>
            {events.map(event => (
              <motion.div 
                key={event._id}
                variants={itemVariants}
                layout
                className="saas-card bg-white overflow-hidden flex flex-col group"
              >
                {/* Media Container */}
                <div className="h-56 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:20px_20px]" />
                    <Calendar size={120} className="absolute -bottom-8 -right-8 text-white opacity-10 group-hover:rotate-12 transition-transform duration-500" />
                  </div>
                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                      {event.category || 'General'}
                    </span>
                  </div>
                  <div className="absolute top-5 right-5">
                    <div className="flex items-center space-x-1 bg-white/90 backdrop-blur rounded-lg px-3 py-1 text-xs font-bold text-indigo-600 shadow-lg">
                      <TrendingUp size={14} />
                      <span>Featured</span>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-black text-white leading-tight drop-shadow-sm group-hover:translate-x-2 transition-transform duration-300">
                      {event.title}
                    </h3>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2 italic font-medium">
                    "{event.description}"
                  </p>

                  <div className="grid grid-cols-2 gap-6 pb-8 border-b border-gray-50">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</p>
                      <div className="flex items-center text-sm font-bold text-gray-800">
                        <Clock size={16} className="mr-2 text-indigo-500" />
                        <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                      <div className="flex items-center text-sm font-bold text-gray-800">
                        <MapPin size={16} className="mr-2 text-indigo-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        +{event.attendees?.length || 0} Attending
                      </span>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRSVP(event._id)}
                      className={`px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-lg ${
                        event.attendees?.some(a => a.user === user?._id)
                        ? 'bg-green-100 text-green-700 shadow-green-100'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                      }`}
                    >
                      {event.attendees?.some(a => a.user === user?._id) ? 'Reserved' : 'RSVP Now'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Events;
