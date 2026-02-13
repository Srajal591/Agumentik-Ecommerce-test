require('dotenv').config();
const mongoose = require('mongoose');

async function fixCategoryIndex() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collection = db.collection('categories');

    console.log('📋 Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });
    console.log('\n');

    // Drop the old unique index on name if it exists
    try {
      console.log('🗑️  Attempting to drop old "name_1" index...');
      await collection.dropIndex('name_1');
      console.log('✅ Old index dropped successfully\n');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  Old index does not exist (already dropped)\n');
      } else {
        console.log('⚠️  Could not drop old index:', error.message, '\n');
      }
    }

    // Create the new compound index
    console.log('🔨 Creating new compound index...');
    await collection.createIndex(
      { name: 1, isDeleted: 1 },
      { 
        unique: true,
        partialFilterExpression: { isDeleted: false },
        name: 'name_1_isDeleted_1_unique'
      }
    );
    console.log('✅ New compound index created successfully\n');

    console.log('📋 Updated indexes:');
    const updatedIndexes = await collection.indexes();
    updatedIndexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
      if (index.partialFilterExpression) {
        console.log(`    Partial filter:`, JSON.stringify(index.partialFilterExpression));
      }
    });
    console.log('\n');

    console.log('🎉 Index fix completed successfully!');
    console.log('\n💡 You can now:');
    console.log('1. Delete a category');
    console.log('2. Create a new category with the same name');
    console.log('3. The old deleted category will remain in database with isDeleted: true');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

fixCategoryIndex();
