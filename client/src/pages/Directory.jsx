import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Filter,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

const Directory = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('Alumni');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/users', {
          params: { role, keyword: search, page }
        });
        setUsers(data.data.users);
        setTotalPages(data.data.pages);
      } catch (error) {
        console.error('Error fetching directory:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [role, search, page]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Alumni Directory</h1>
          <p className="text-gray-500 mt-1">Search and connect with {role === 'Alumni' ? 'graduates' : 'students'} in your network.</p>
        </div>

        <div className="flex bg-white p-1 rounded-xl saas-card">
          <button 
            onClick={() => { setRole('Alumni'); setPage(1); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              role === 'Alumni' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Alumni
          </button>
          <button 
            onClick={() => { setRole('Student'); setPage(1); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              role === 'Student' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Students
          </button>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="saas-card p-2 flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder={`Search ${role.toLowerCase()} by name, skills, or location...`}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
          Find Professional
        </button>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-white saas-card animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 saas-card bg-white/50 border-dashed border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-400">No matching connections found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {users.map(user => (
              <motion.div 
                key={user._id}
                variants={itemVariants}
                layout
                className="saas-card p-6 flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      {user.name.charAt(0)}
                    </div>
                    <button 
                      onClick={() => navigate(`/profile/${user._id}`)}
                      className="text-xs font-bold text-blue-600 uppercase tracking-wider hover:underline"
                    >
                      View Profile
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{user.name}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    {user.profile?.title || user.role} • Class of {user.profile?.batch || '2023'}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase size={16} className="mr-3 text-gray-400" />
                      <span className="truncate">{user.profile?.company || 'Freelance / Open to Work'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-3 text-gray-400" />
                      <span>{user.profile?.location || 'Location Private'}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {user.profile?.skills?.slice(0, 3).map(skill => (
                      <span key={skill} className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase rounded-full border border-gray-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50">
                  <button 
                    onClick={() => navigate(`/chat/${user._id}`)}
                    className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <MessageSquare size={16} className="mr-2" /> Start Conversation
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-12 pb-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                page === i + 1 
                ? 'bg-blue-600 text-white shadow-lg scale-110' 
                : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Directory;
