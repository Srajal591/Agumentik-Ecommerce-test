const adminManagementService = require('../services/adminManagementService');

// Create admin
exports.createAdmin = async (req, res, next) => {
  try {
    console.log('📝 Creating admin with data:', { ...req.body, password: '***' });
    const admin = await adminManagementService.createAdmin(req.body);
    console.log('✅ Admin created:', admin.email);

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: admin,
    });
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    next(error);
  }
};

// Get all admins
exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await adminManagementService.getAllAdmins();

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    next(error);
  }
};

// Get admin by ID
exports.getAdminById = async (req, res, next) => {
  try {
    const admin = await adminManagementService.getAdminById(req.params.id);

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

// Update admin
exports.updateAdmin = async (req, res, next) => {
  try {
    console.log('📝 Updating admin', req.params.id);
    const admin = await adminManagementService.updateAdmin(req.params.id, req.body);
    console.log('✅ Admin updated:', admin.email);

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: admin,
    });
  } catch (error) {
    console.error('❌ Error updating admin:', error.message);
    next(error);
  }
};

// Block/Unblock admin
exports.toggleAdminBlock = async (req, res, next) => {
  try {
    const admin = await adminManagementService.toggleAdminBlock(req.params.id);

    res.status(200).json({
      success: true,
      message: `Admin ${admin.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

// Delete admin
exports.deleteAdmin = async (req, res, next) => {
  try {
    const result = await adminManagementService.deleteAdmin(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
