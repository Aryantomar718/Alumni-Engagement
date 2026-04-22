import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock,
  ChevronRight,
  Search,
  Filter,
  X
} from 'lucide-react';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time',
    description: ''
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get('/jobs');
      setJobs(res.data.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      await API.post(`/jobs/${jobId}/apply`);
      fetchJobs();
    } catch (error) {
      console.error('Failed to apply', error);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await API.post('/jobs', formData);
      setShowModal(false);
      setFormData({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: 'Full-time',
        description: ''
      });
      fetchJobs();
    } catch (error) {
      console.error('Failed to post job', error);
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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Career Opportunities</h1>
          <p className="text-gray-500 mt-1">Discover internal hiring and exclusive roles for the alumni network.</p>
        </div>
        {(user?.role === 'Alumni' || user?.role === 'Admin') && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-3 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 font-bold"
          >
            <Plus size={20} />
            <span>Post Opportunity</span>
          </motion.button>
        )}
      </div>

      {/* Search & Tabs */}
      <div className="saas-card p-2 flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search roles, companies, or industries..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
        <div className="flex px-2 space-x-2">
          {['All', 'Full-time', 'Internship'].map(tab => (
            <button key={tab} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Job Listings section */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white saas-card animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 saas-card bg-white/50 border-dashed border-2 border-gray-200">
          <Briefcase size={48} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-400">No active opportunities</h3>
          <p className="text-gray-400 mt-1">Be the first to share a role with the network.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6"
        >
          {jobs.map(job => (
            <motion.div 
              key={job._id}
              variants={itemVariants}
              className="saas-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-200"
            >
              <div className="flex items-start space-x-5">
                <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center font-bold text-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-3 text-sm text-gray-500 font-medium">
                    <span className="flex items-center"><Briefcase size={16} className="mr-2 text-gray-400" /> {job.company}</span>
                    <span className="flex items-center"><MapPin size={16} className="mr-2 text-gray-400" /> {job.location}</span>
                    <span className="flex items-center font-bold text-gray-800"><DollarSign size={16} className="mr-1" /> {job.salary}</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">{job.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 pr-2">
                {user?.role === 'Student' && (
                  <button 
                    onClick={() => handleApply(job._id)}
                    disabled={job.applications?.some(app => app.student === user?._id)}
                    className={`px-10 py-3 rounded-xl font-bold transition-all shadow-sm ${
                      job.applications?.some(app => app.student === user?._id)
                      ? 'bg-green-100 text-green-700 cursor-default scale-95'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                    }`}
                  >
                    {job.applications?.some(app => app.student === user?._id) ? 'Application Sent' : 'Easy Apply'}
                  </button>
                )}
                <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-blue-600 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Post Job Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative z-10"
            >
              <div className="bg-blue-600 p-8 text-white flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Hire from the Network</h2>
                  <p className="text-blue-100 mt-1 opacity-80">Help fellow alumni or students find their next breakthrough.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateJob} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Job Title</label>
                  <input 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Company</label>
                  <input 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location</label>
                  <input 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Salary Range</label>
                  <input 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Type</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2 flex justify-end space-x-4 mt-8">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-8 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-12 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                  >
                    Post Position
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Jobs;

