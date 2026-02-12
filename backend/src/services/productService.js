const Product = require('../models/Product');

class ProductService {
  // Create product
  async createProduct(productData) {
    const product = await Product.create(productData);
    return await product.populate('category');
  }

  // Get all products with filters and pagination
  async getAllProducts(filters, page, limit, skip) {
    const query = { isDeleted: false };

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { brand: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
    }

    const products = await Product.find(query)
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get product by ID
  async getProductById(productId) {
    const product = await Product.findOne({ _id: productId, isDeleted: false }).populate(
      'category'
    );

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  // Update product
  async updateProduct(productId, updateData) {
    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    }).populate('category');

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  // Update product status
  async updateProductStatus(productId, status) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    product.status = status;
    await product.save();

    return product;
  }

  // Update inventory
  async updateInventory(productId, sizeUpdates) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    sizeUpdates.forEach((update) => {
      const sizeIndex = product.sizes.findIndex((s) => s.size === update.size);
      if (sizeIndex > -1) {
        product.sizes[sizeIndex].stock = update.stock;
      }
    });

    await product.save();
    return product;
  }

  // Soft delete product
  async deleteProduct(productId) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    product.isDeleted = true;
    await product.save();

    return { message: 'Product deleted successfully' };
  }
}

module.exports = new ProductService();
