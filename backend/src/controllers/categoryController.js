const categoryService = require('../services/categoryService');

// Create category
exports.createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const includeInactive = req.user?.role === 'admin';
    const categories = await categoryService.getAllCategories(includeInactive);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get category by ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Update category
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle category status
exports.toggleCategoryStatus = async (req, res, next) => {
  try {
    const category = await categoryService.toggleCategoryStatus(req.params.id);

    res.status(200).json({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Delete category
exports.deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
