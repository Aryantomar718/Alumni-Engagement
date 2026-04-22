import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Check, 
  X, 
  Clock,
  Send,
  Loader2,
  UserCheck,
  Zap
} from 'lucide-react';

const Mentorship = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await API.get('/mentorship/my-requests');
      setRequests(res.data.data);
    } catch (error) {
      console.error('Error fetching mentorship requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (id, status) => {
    try {
      await API.put(`/mentorship/${id}/respond`, { status });
      fetchRequests();
    } catch (error) {
      console.error('Failed to respond', error);
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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentorship Hub</h1>
          <p className="text-gray-500 mt-1">
            {user?.role === 'Alumni' 
              ? 'Guide the next generation of talent.' 
              : 'Connect with industry experts for career guidance.'}
          </p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest">
          <Zap size={14} className="fill-current" />
          <span>{requests.length} Connections</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-400 font-medium animate-pulse">Syncing requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="saas-card bg-white/50 border-dashed border-2 border-gray-200 p-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <UserCheck size={40} className="text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No mentorship activity yet</h3>
          <p className="text-gray-400 max-w-sm mx-auto mt-2">
            {user?.role === 'Alumni' 
              ? 'When students request your guidance, they will appear here.' 
              : 'Browse the directory to find a mentor who matches your goals!'}
          </p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {requests.map(req => {
              const otherUser = user?._id === req.student?._id ? req.alumni : req.student;
              return (
                <motion.div 
                  key={req._id}
                  variants={itemVariants}
                  layout
                  className="saas-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-100"
                >
                  <div className="flex items-start space-x-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-100">
                      {otherUser?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          {user?._id === req.student?._id ? `Mentor: ${otherUser?.name}` : `Student: ${otherUser?.name}`}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                          req.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                        <span className="text-gray-400 font-bold block text-[10px] uppercase mb-1">Inquiry:</span>
                        "{req.message}"
                      </p>
                      <div className="flex items-center mt-4 space-x-4 text-xs text-gray-400 font-medium">
                        <span className="flex items-center"><Clock size={14} className="mr-2" /> Requested {new Date(req.requestedAt).toLocaleDateString()}</span>
                        {req.status === 'Accepted' && <span className="flex items-center text-green-600"><Check size={14} className="mr-1" /> Active Partnership</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {user?.role === 'Alumni' && req.status === 'Pending' && (
                      <>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRespond(req._id, 'Accepted')}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                        >
                          <Check size={18} />
                          <span>Approve</span>
                        </motion.button>
                        <button 
                          onClick={() => handleRespond(req._id, 'Rejected')}
                          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <X size={20} />
                        </button>
                      </>
                    )}

                    {req.status === 'Accepted' && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/chat/${otherUser?._id}`)}
                        className="flex items-center space-x-3 bg-white border border-blue-100 text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold shadow-sm"
                      >
                        <MessageSquare size={18} />
                        <span>Send Message</span>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Mentorship;
