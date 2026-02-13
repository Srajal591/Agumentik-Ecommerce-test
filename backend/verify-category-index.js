require('dotenv').config();
const mongoose = require('mongoose');

async function verifyIndex() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collection = db.collection('categories');

    console.log('📋 Current indexes on categories collection:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`\n  Index: ${index.name}`);
      console.log(`  Keys:`, JSON.stringify(index.key));
      if (index.unique) {
        console.log(`  Unique: true`);
      }
      if (index.partialFilterExpression) {
        console.log(`  Partial filter:`, JSON.stringify(index.partialFilterExpression));
      }
    });
    console.log('\n');

    console.log('✅ Index verification complete!');
    console.log('\n💡 The compound index allows:');
    console.log('- Multiple categories with same name if some are deleted (isDeleted: true)');
    console.log('- Only ONE active category with a specific name (isDeleted: false)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

verifyIndex();
