const User = require('../models/User');

class UserService {
  // Get all users with pagination and role filter
  async getAllUsers(page, limit, skip, role = null) {
    // Build query
    const query = { isDeleted: false };
    
    // Add role filter if provided
    if (role) {
      if (role === 'users') {
        query.role = 'user';
      } else if (role === 'admins') {
        query.role = { $in: ['admin', 'super_admin'] };
      }
    } else {
      // Default: only show regular users
      query.role = 'user';
    }

    // Execute query with pagination
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query)
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get user by ID
  async getUserById(userId) {
    const user = await User.findOne({ _id: userId, isDeleted: false })
      .select('-password')
      .lean();

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    // Prevent role and sensitive field updates
    const { role, password, isDeleted, ...safeUpdateData } = updateData;

    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      safeUpdateData,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Block/Unblock user
  async toggleBlockUser(userId) {
    const user = await User.findOne({ _id: userId, isDeleted: false });

    if (!user) {
      throw new Error('User not found');
    }

    // Prevent blocking super_admin
    if (user.role === 'super_admin') {
      throw new Error('Cannot block super admin');
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
  }

  // Add address
  async addAddress(userId, addressData) {
    const user = await User.findOne({ _id: userId, isDeleted: false });

    if (!user) {
      throw new Error('User not found');
    }

    // If this is the first address or marked as default, set it as default
    if (user.addresses.length === 0 || addressData.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
      addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();

    return user.addresses;
  }

  // Update address
  async updateAddress(userId, addressId, addressData) {
    const user = await User.findOne({ _id: userId, isDeleted: false });

    if (!user) {
      throw new Error('User not found');
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    Object.assign(address, addressData);

    if (addressData.isDefault) {
      user.addresses.forEach((addr) => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    await user.save();
    return user.addresses;
  }

  // Delete address
  async deleteAddress(userId, addressId) {
    const user = await User.findOne({ _id: userId, isDeleted: false });

    if (!user) {
      throw new Error('User not found');
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    user.addresses.pull(addressId);
    await user.save();

    return user.addresses;
  }

  // Manage wishlist
  async toggleWishlist(userId, productId) {
    const user = await User.findOne({ _id: userId, isDeleted: false });

    if (!user) {
      throw new Error('User not found');
    }

    const index = user.wishlist.indexOf(productId);

    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    return user.wishlist;
  }

  // Get wishlist
  async getWishlist(userId) {
    const user = await User.findOne({ _id: userId, isDeleted: false })
      .populate({
        path: 'wishlist',
        match: { isDeleted: false, isActive: true },
        select: 'name price images category stock'
      })
      .lean();

    if (!user) {
      throw new Error('User not found');
    }

    return user.wishlist || [];
  }
}

module.exports = new UserService();
