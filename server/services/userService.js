const User = require('../models/User');

/**
 * Service to handle User related business logic
 */
class UserService {
  /**
   * Get filtered alumni directory
   */
  async getUsers(filters) {
    const { role, keyword, skills, industry, page = 1, limit = 12 } = filters;
    const query = {};

    if (role) query.role = role;
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { 'profile.company': { $regex: keyword, $options: 'i' } },
        { 'profile.location': { $regex: keyword, $options: 'i' } }
      ];
    }
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query['profile.skills'] = { $in: skillsArray };
    }
    if (industry) query['profile.industry'] = industry;

    const skip = (page - 1) * limit;
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(Number(limit));

    return {
      users,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    const user = await User.findById(id).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (updateData.name) user.name = updateData.name;
    if (updateData.profile) {
      user.profile = { ...user.profile, ...updateData.profile };
    }

    return await user.save();
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    await user.deleteOne();
    return { message: 'User removed' };
  }

  /**
   * Get system stats
   */
  async getStats() {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'Student' });
    const alumni = await User.countDocuments({ role: 'Alumni' });
    
    const industryStats = await User.aggregate([
      { $match: { role: 'Alumni' } },
      { $group: { _id: '$profile.industry', count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } }
    ]);

    return {
      totalUsers,
      roleDistribution: {
        students,
        alumni,
        admin: totalUsers - students - alumni
      },
      industryStats
    };
  }
}

module.exports = new UserService();
