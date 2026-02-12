const productService = require('../services/productService');

// Create product
exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination;
    const filters = {
      category: req.query.category,
      status: req.query.status,
      search: req.query.search,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
    };

    const result = await productService.getAllProducts(filters, page, limit, skip);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product status
exports.updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const product = await productService.updateProductStatus(req.params.id, status);

    res.status(200).json({
      success: true,
      message: 'Product status updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update inventory
exports.updateInventory = async (req, res, next) => {
  try {
    const { sizes } = req.body;
    const product = await productService.updateInventory(req.params.id, sizes);

    res.status(200).json({
      success: true,
      message: 'Inventory updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
