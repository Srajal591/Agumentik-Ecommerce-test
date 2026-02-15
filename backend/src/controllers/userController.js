const userService = require('../services/userService');

// Get all users (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination;
    const { role } = req.query; // Get role filter from query params
    
    const result = await userService.getAllUsers(page, limit, skip, role);

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
    const userId = req.user.role === 'admin' || req.user.role === 'super_admin' 
      ? req.params.id 
      : req.user._id;
    
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
    const addresses = await userService.addAddress(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

// Update address
exports.updateAddress = async (req, res, next) => {
  try {
    const addresses = await userService.updateAddress(req.user._id, req.params.addressId, req.body);

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

// Delete address
exports.deleteAddress = async (req, res, next) => {
  try {
    const addresses = await userService.deleteAddress(req.user._id, req.params.addressId);

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle wishlist
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const wishlist = await userService.toggleWishlist(req.user._id, productId);

    res.status(200).json({
      success: true,
      message: 'Wishlist updated successfully',
      data: wishlist,
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
