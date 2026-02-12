const returnService = require('../services/returnService');

// Create return request
exports.createReturn = async (req, res, next) => {
  try {
    const returnRequest = await returnService.createReturn(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: 'Return request created successfully',
      data: returnRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Get all returns
exports.getAllReturns = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination;
    const filters = {
      status: req.query.status,
      type: req.query.type,
      userId: req.user.role === 'user' ? req.user._id : req.query.userId,
    };

    const result = await returnService.getAllReturns(filters, page, limit, skip);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get return by ID
exports.getReturnById = async (req, res, next) => {
  try {
    const returnRequest = await returnService.getReturnById(req.params.id);

    // Check if user has permission to view this return
    if (
      req.user.role !== 'admin' &&
      returnRequest.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.status(200).json({
      success: true,
      data: returnRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Update return status (Admin)
exports.updateReturnStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, refundAmount } = req.body;
    const returnRequest = await returnService.updateReturnStatus(
      req.params.id,
      status,
      adminNotes,
      refundAmount
    );

    res.status(200).json({
      success: true,
      message: 'Return status updated successfully',
      data: returnRequest,
    });
  } catch (error) {
    next(error);
  }
};
