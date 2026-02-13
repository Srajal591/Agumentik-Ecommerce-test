const Category = require('../models/Category');

class CategoryService {
  // Create category
  async createCategory(categoryData) {
    // Check if category with same name exists (and not deleted)
    const existingCategory = await Category.findOne({
      name: categoryData.name,
      isDeleted: false,
    });

    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const category = await Category.create(categoryData);
    return category;
  }

  // Get all categories
  async getAllCategories(includeInactive = false) {
    const filter = { isDeleted: false };
    if (!includeInactive) {
      filter.isActive = true;
    }

    const categories = await Category.find(filter).sort({ name: 1 });
    return categories;
  }

  // Get category by ID
  async getCategoryById(categoryId) {
    const category = await Category.findOne({ _id: categoryId, isDeleted: false });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  // Update category
  async updateCategory(categoryId, updateData) {
    // If updating name, check if another category with same name exists (and not deleted)
    if (updateData.name) {
      const existingCategory = await Category.findOne({
        name: updateData.name,
        isDeleted: false,
        _id: { $ne: categoryId }, // Exclude current category
      });

      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }
    }

    const category = await Category.findByIdAndUpdate(categoryId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  // Toggle category active status
  async toggleCategoryStatus(categoryId) {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    category.isActive = !category.isActive;
    await category.save();

    return category;
  }

  // Soft delete category
  async deleteCategory(categoryId) {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    category.isDeleted = true;
    await category.save();

    return { message: 'Category deleted successfully' };
  }
}

module.exports = new CategoryService();
