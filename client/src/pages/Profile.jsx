import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  Globe,
  Save,
  Plus,
  Trash2,
  Linkedin,
  Github,
  Twitter,
  Edit3,
  CheckCircle2
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    profile: {
      bio: '',
      location: '',
      company: '',
      title: '',
      industry: '',
      batch: '',
      skills: [],
      socialLinks: { linkedin: '', github: '', twitter: '' }
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/auth/me');
        const userData = data.data;
        setProfile(userData);
        setFormData({
          name: userData.name,
          profile: {
            ...userData.profile,
            skills: userData.profile?.skills || [],
            socialLinks: userData.profile?.socialLinks || { linkedin: '', github: '', twitter: '' }
          }
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await API.put('/users/profile', formData);
      setEditing(false);
      setProfile({ ...profile, ...formData, ...res.data.data });
    } catch (error) {
      console.error('Failed to update profile', error);
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Profile...</p>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-12 pb-20"
    >
      {/* Header with Background Pattern */}
      <div className="relative h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:40px_40px]" />
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-t from-black/40 to-transparent">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-1 shadow-2xl">
              <div className="w-full h-full rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-4xl font-bold border-2 border-white">
                {profile?.name.charAt(0)}
              </div>
            </div>
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{profile?.name}</h1>
              <div className="flex items-center space-x-4 mt-2 opacity-90 font-medium">
                <span className="bg-white/20 px-3 py-1 rounded-lg text-xs uppercase tracking-widest">{profile?.role}</span>
                <span className="flex items-center text-sm"><MapPin size={14} className="mr-1" /> {profile?.profile?.location || 'Global'}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={editing ? handleSave : () => setEditing(true)}
            className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl ${
              editing 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            {editing ? <Save size={20} /> : <Edit3 size={20} />}
            <span>{editing ? 'Apply Modern Changes' : 'Refine Brand'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div variants={itemVariants} className="saas-card p-6 bg-white">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Contact Channels</h3>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <Mail className="text-blue-600 mr-3 shrink-0" size={18} />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Professional Email</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <Globe className="text-indigo-600 mr-3 shrink-0" size={18} />
                <div className="min-w-0 w-full">
                  <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Global Presence</p>
                  <p className="text-sm font-semibold text-gray-900 truncate leading-none">
                    {editing ? (
                      <input 
                        className="w-full bg-transparent border-none outline-none text-sm p-0 m-0 leading-none h-auto"
                        value={formData.profile.location}
                        onChange={(e) => setFormData({...formData, profile: {...formData.profile, location: e.target.value}})}
                      />
                    ) : (profile?.profile?.location || 'Digital Nomad')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="saas-card p-6 bg-white">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Ecosystem Links</h3>
            <div className="space-y-4">
              {Object.keys(formData.profile.socialLinks).map(platform => {
                const Icon = platform === 'linkedin' ? Linkedin : platform === 'github' ? Github : Twitter;
                return (
                  <div key={platform} className="group">
                    <p className="text-[10px] uppercase font-bold text-gray-400 ml-1 mb-2">{platform}</p>
                    {editing ? (
                      <input 
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        value={formData.profile.socialLinks[platform]}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            socialLinks: { ...formData.profile.socialLinks, [platform]: e.target.value }
                          }
                        })}
                      />
                    ) : (
                      <div className="flex items-center p-3 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer group">
                        <Icon size={18} className="text-gray-400 group-hover:text-blue-600 mr-3" />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 truncate">
                          {profile?.profile?.socialLinks?.[platform] || 'Add link'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Main Content Areas */}
        <div className="lg:col-span-8 space-y-8">
          {/* Bio Section */}
          <motion.div variants={itemVariants} className="saas-card p-8 bg-white">
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="text-blue-600" size={20} />
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Executive Summary</h3>
            </div>
            {editing ? (
              <textarea 
                className="w-full h-40 p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all leading-relaxed"
                placeholder="Compose your professional narrative..."
                value={formData.profile.bio}
                onChange={(e) => setFormData({
                  ...formData,
                  profile: { ...formData.profile, bio: e.target.value }
                })}
              />
            ) : (
              <p className="text-gray-600 leading-relaxed font-medium">
                {profile?.profile?.bio || 'No professional summary available. Elevate your brand by adding a compelling narrative of your journey.'}
              </p>
            )}
          </motion.div>

          {/* Professional Credentials */}
          <motion.div variants={itemVariants} className="saas-card p-8 bg-white">
            <div className="flex items-center space-x-2 mb-8">
              <Briefcase className="text-blue-600" size={20} />
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Credentials & Foundation</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Active Institution / Firm</p>
                {editing ? (
                  <input 
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 outline-none"
                    value={formData.profile.company}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, company: e.target.value }
                    })}
                  />
                ) : (
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-lg font-bold text-gray-800">{profile?.profile?.company || 'Ecosystem Partner'}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Alumni Legacy Year</p>
                {editing ? (
                  <input 
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 outline-none"
                    value={formData.profile.batch}
                    onChange={(e) => setFormData({
                      ...formData,
                      profile: { ...formData.profile, batch: e.target.value }
                    })}
                  />
                ) : (
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 size={16} className="text-blue-500" />
                    <span className="text-lg font-bold text-gray-800">{profile?.profile?.batch || '2023'}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Skill Matrix */}
          <motion.div variants={itemVariants} className="saas-card p-8 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Plus size={80} />
            </div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <Plus className="text-blue-600" size={20} />
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Strategic Skill Matrix</h3>
              </div>
              {editing && (
                <button 
                  onClick={() => {
                    const skill = prompt('Define a new competency:');
                    if (skill) setFormData({
                      ...formData,
                      profile: { ...formData.profile, skills: [...formData.profile.skills, skill] }
                    });
                  }}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  <Plus size={18} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {(editing ? formData.profile.skills : profile?.profile?.skills)?.map((skill, i) => (
                <motion.div 
                  key={i} 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center px-5 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-blue-100 group shadow-sm"
                >
                  {skill}
                  {editing && (
                    <button 
                      onClick={() => setFormData({
                        ...formData,
                        profile: { 
                          ...formData.profile, 
                          skills: formData.profile.skills.filter((_, idx) => idx !== i) 
                        }
                      })}
                      className="ml-3 text-blue-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </motion.div>
              ))}
              {(!editing && !profile?.profile?.skills?.length) && <p className="text-sm text-gray-400 font-medium italic">No competencies defined yet.</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
