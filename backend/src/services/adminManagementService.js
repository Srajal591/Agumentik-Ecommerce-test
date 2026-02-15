const User = require('../models/User');
const bcrypt = require('bcrypt');

class AdminManagementService {
  // Create new admin (only by super_admin)
  async createAdmin(adminData) {
    const { name, email, mobile, password } = adminData;

    // Check if admin with email already exists
    const existingAdmin = await User.findOne({ email, isDeleted: false });
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }

    // Check if mobile already exists
    const existingMobile = await User.findOne({ mobile, isDeleted: false });
    if (existingMobile) {
      throw new Error('Admin with this mobile number already exists');
    }

    // Create admin
    const admin = await User.create({
      name,
      email,
      mobile,
      password,
      role: 'admin',
    });

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    return adminResponse;
  }

  // Get all admins (only by super_admin)
  async getAllAdmins() {
    const admins = await User.find({
      role: 'admin',
      isDeleted: false,
    })
      .select('-password')
      .sort({ createdAt: -1 });

    return admins;
  }

  // Get admin by ID
  async getAdminById(adminId) {
    const admin = await User.findOne({
      _id: adminId,
      role: 'admin',
      isDeleted: false,
    }).select('-password');

    if (!admin) {
      throw new Error('Admin not found');
    }

    return admin;
  }

  // Update admin
  async updateAdmin(adminId, updateData) {
    const { name, email, mobile, password } = updateData;

    // Check if admin exists
    const admin = await User.findOne({ _id: adminId, role: 'admin', isDeleted: false });
    if (!admin) {
      throw new Error('Admin not found');
    }

    // Check if email is being changed and already exists
    if (email && email !== admin.email) {
      const existingEmail = await User.findOne({
        email,
        isDeleted: false,
        _id: { $ne: adminId },
      });
      if (existingEmail) {
        throw new Error('Email already in use');
      }
      admin.email = email;
    }

    // Check if mobile is being changed and already exists
    if (mobile && mobile !== admin.mobile) {
      const existingMobile = await User.findOne({
        mobile,
        isDeleted: false,
        _id: { $ne: adminId },
      });
      if (existingMobile) {
        throw new Error('Mobile number already in use');
      }
      admin.mobile = mobile;
    }

    // Update other fields
    if (name) admin.name = name;
    if (password) admin.password = password;

    await admin.save();

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    return adminResponse;
  }

  // Block/Unblock admin
  async toggleAdminBlock(adminId) {
    const admin = await User.findOne({ _id: adminId, role: 'admin', isDeleted: false });

    if (!admin) {
      throw new Error('Admin not found');
    }

    admin.isBlocked = !admin.isBlocked;
    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    return adminResponse;
  }

  // Delete admin (soft delete)
  async deleteAdmin(adminId) {
    const admin = await User.findOne({ _id: adminId, role: 'admin', isDeleted: false });

    if (!admin) {
      throw new Error('Admin not found');
    }

    admin.isDeleted = true;
    await admin.save();

    return { message: 'Admin deleted successfully' };
  }
}

module.exports = new AdminManagementService();
