require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');

async function updateElectronicsImage() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // The image URL from your upload
    const imageUrl = 'https://res.cloudinary.com/dno4ebvqz/image/upload/v1770978198/categories/uqohtgp1pukmkvmsxymx.jpg';
    
    // Update Electronics category
    const result = await Category.updateOne(
      { name: 'Electronics', isDeleted: false },
      { $set: { image: imageUrl } }
    );

    console.log('✅ Update result:', result);

    // Verify
    const category = await Category.findOne({ name: 'Electronics', isDeleted: false });
    console.log('\n📋 Electronics category:');
    console.log('   Name:', category.name);
    console.log('   Image:', category.image);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

updateElectronicsImage();
