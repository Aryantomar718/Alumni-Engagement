const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['Student', 'Alumni', 'Admin'],
    default: 'Student'
  },
  // Profiles fields
  profile: {
    bio: String,
    skills: [String],
    location: String,
    company: String,
    industry: String,
    batch: String,
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String
    },
    workExperience: [
      {
        title: String,
        company: String,
        duration: String,
        description: String
      }
    ],
    profileImage: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indices for performance
userSchema.index({ role: 1 });
userSchema.index({ 'profile.skills': 1 });
userSchema.index({ 'profile.industry': 1 });
userSchema.index({ name: 'text', 'profile.company': 'text', 'profile.location': 'text' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
