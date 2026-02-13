require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');

async function testCategoryDelete() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const testName = 'Test Category ' + Date.now();

    // Step 1: Create a category
    console.log('1️⃣  Creating category:', testName);
    const category1 = await Category.create({
      name: testName,
      description: 'First test category',
    });
    console.log('✅ Created:', category1._id, '\n');

    // Step 2: Soft delete the category
    console.log('2️⃣  Soft deleting category...');
    category1.isDeleted = true;
    await category1.save();
    console.log('✅ Deleted (isDeleted: true)\n');

    // Step 3: Try to create another category with same name
    console.log('3️⃣  Creating new category with same name:', testName);
    try {
      const category2 = await Category.create({
        name: testName,
        description: 'Second test category (same name)',
      });
      console.log('✅ SUCCESS! Created new category:', category2._id);
      console.log('   This proves soft delete works correctly!\n');

      // Verify both exist in database
      console.log('4️⃣  Verifying both categories exist:');
      const allCategories = await Category.find({ name: testName });
      console.log(`   Found ${allCategories.length} categories with name "${testName}"`);
      allCategories.forEach((cat, index) => {
        console.log(`   ${index + 1}. ID: ${cat._id}, isDeleted: ${cat.isDeleted}`);
      });
      console.log('\n');

      // Cleanup
      console.log('5️⃣  Cleaning up test data...');
      await Category.deleteMany({ name: testName });
      console.log('✅ Test data cleaned up\n');

      console.log('🎉 TEST PASSED! Soft delete with same name works correctly!');

    } catch (error) {
      console.error('❌ FAILED! Could not create category with same name');
      console.error('   Error:', error.message);
      console.log('\n💡 This means the index is not working correctly.');
      
      // Cleanup
      await Category.deleteMany({ name: testName });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

testCategoryDelete();
