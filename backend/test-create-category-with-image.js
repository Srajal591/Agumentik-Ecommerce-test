require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');

async function testCreateCategoryWithImage() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Create a test category with image
    const testImageUrl = 'https://res.cloudinary.com/dno4ebvqz/image/upload/v1770978198/categories/uqohtgp1pukmkvmsxymx.jpg';
    
    console.log('📝 Creating test category with image...');
    const category = await Category.create({
      name: 'Test Category ' + Date.now(),
      description: 'Test category with image',
      image: testImageUrl,
    });

    console.log('✅ Category created successfully!');
    console.log('   ID:', category._id);
    console.log('   Name:', category.name);
    console.log('   Image:', category.image);
    console.log('\n');

    // Verify it was saved
    const saved = await Category.findById(category._id);
    console.log('✅ Verification - Category retrieved from DB:');
    console.log('   Name:', saved.name);
    console.log('   Image:', saved.image);
    console.log('\n');

    if (saved.image === testImageUrl) {
      console.log('🎉 SUCCESS! Image URL is saved correctly in database');
    } else {
      console.log('❌ FAILED! Image URL not saved correctly');
    }

    // Cleanup
    await Category.deleteOne({ _id: category._id });
    console.log('\n✅ Test category deleted');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

testCreateCategoryWithImage();
