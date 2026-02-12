const userService = require('../services/userService');

// Get all users (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination;
    const result = await userService.getAllUsers(page, limit, skip);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.role === 'admin' ? req.params.id : req.user._id;
    const user = await userService.updateProfile(userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Block/Unblock user (Admin only)
exports.toggleBlockUser = async (req, res, next) => {
  try {
    const user = await userService.toggleBlockUser(req.params.id);

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Add address
exports.addAddress = async (req, res, next) => {
  try {
    const user = await userService.addAddress(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// Update address
exports.updateAddress = async (req, res, next) => {
  try {
    const user = await userService.updateAddress(req.user._id, req.params.addressId, req.body);

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// Delete address
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await userService.deleteAddress(req.user._id, req.params.addressId);

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle wishlist
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await userService.toggleWishlist(req.user._id, productId);

    res.status(200).json({
      success: true,
      message: 'Wishlist updated successfully',
      data: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// Get wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await userService.getWishlist(req.user._id);

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};
