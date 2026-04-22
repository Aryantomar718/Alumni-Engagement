import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="saas-card p-6 flex items-center space-x-4"
  >
    <div className={`p-4 rounded-xl bg-opacity-10 ${color.bg} ${color.text}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          API.get('/users/stats'),
          API.get('/jobs?limit=5')
        ]);
        setStats(statsRes.data.data);
        setRecentJobs(jobsRes.data.data.jobs);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="h-40 bg-white saas-card animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white saas-card animate-pulse" />)}
      </div>
    </div>
  );

  const chartData = stats?.industryStats?.map(item => ({
    name: item._id || 'Other',
    count: item.count
  })) || [];

  const COLORS = ['#0A66C2', '#0073B1', '#00A0DC', '#004182', '#0084BF'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Morning, {user?.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 mt-1">Grow your network and search for new opportunities.</p>
        </div>
        <div className="hidden md:block">
          <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full uppercase">
            {user?.role} Dashboard
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          index={0}
          title="Total Network" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
          color={{ bg: 'bg-blue-500', text: 'text-blue-600' }} 
        />
        <StatCard 
          index={1}
          title="Alumni" 
          value={stats?.roleDistribution?.alumni || 0} 
          icon={TrendingUp} 
          color={{ bg: 'bg-indigo-500', text: 'text-indigo-600' }} 
        />
        <StatCard 
          index={2}
          title="Students" 
          value={stats?.roleDistribution?.students || 0} 
          icon={Users} 
          color={{ bg: 'bg-sky-500', text: 'text-sky-600' }} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Industry Distribution Chart */}
        <motion.div variants={containerVariants} className="lg:col-span-2 saas-card p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-900">Alumni Industry Presence</h3>
            <p className="text-xs text-gray-400 font-medium italic">Aggregated from private profiles</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '10px 14px'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Job Postings Sidebar */}
        <motion.div variants={containerVariants} className="saas-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Picks for You</h3>
            <Briefcase size={16} className="text-gray-400" />
          </div>
          <div className="space-y-6">
            {recentJobs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Searching for roles...</p>
            ) : (
              recentJobs.map((job, idx) => (
                <motion.div 
                  key={job._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group cursor-pointer border-b border-gray-50 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0">
                      <span className="text-blue-600 font-bold text-lg">{job.company.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">{job.title}</h4>
                      <p className="text-xs text-gray-600 font-medium">{job.company}</p>
                      <div className="flex items-center text-[10px] text-gray-400 mt-2 space-x-2">
                        <span className="flex items-center"><Clock size={10} className="mr-1" /> {new Date(job.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          <button className="w-full mt-8 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center justify-center border border-blue-100">
            Show more <ArrowRight size={16} className="ml-2" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
