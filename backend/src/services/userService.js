const User = require('../models/User');

class UserService {
  // Get all users with pagination
  async getAllUsers(page, limit, skip) {
    const users = await User.find({ role: 'user', isDeleted: false })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: 'user', isDeleted: false });

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
    const user = await User.findOne({ _id: userId, isDeleted: false }).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Block/Unblock user
  async toggleBlockUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return user;
  }

  // Add address
  async addAddress(userId, addressData) {
    const user = await User.findById(userId);

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

    return user;
  }

  // Update address
  async updateAddress(userId, addressId, addressData) {
    const user = await User.findById(userId);

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
    return user;
  }

  // Delete address
  async deleteAddress(userId, addressId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.addresses.pull(addressId);
    await user.save();

    return user;
  }

  // Manage wishlist
  async toggleWishlist(userId, productId) {
    const user = await User.findById(userId);

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
    return user;
  }

  // Get wishlist
  async getWishlist(userId) {
    const user = await User.findById(userId).populate('wishlist');

    if (!user) {
      throw new Error('User not found');
    }

    return user.wishlist;
  }
}

module.exports = new UserService();
