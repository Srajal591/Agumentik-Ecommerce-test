require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('🔍 Testing Cloudinary Configuration...\n');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'NOT SET');
console.log('\n');

// Test Cloudinary connection
async function testCloudinary() {
  try {
    console.log('📡 Testing Cloudinary connection...');
    
    // Test by getting account details
    const result = await cloudinary.api.ping();
    
    console.log('✅ Cloudinary connection successful!');
    console.log('Status:', result.status);
    console.log('\n');
    
    // Get usage details
    console.log('📊 Fetching account usage...');
    const usage = await cloudinary.api.usage();
    
    console.log('✅ Account Details:');
    console.log('Plan:', usage.plan);
    console.log('Credits Used:', usage.credits.usage);
    console.log('Credits Limit:', usage.credits.limit);
    console.log('Storage Used:', (usage.storage.usage / 1024 / 1024).toFixed(2), 'MB');
    console.log('Bandwidth Used:', (usage.bandwidth.usage / 1024 / 1024).toFixed(2), 'MB');
    console.log('\n');
    
    // List folders
    console.log('📁 Listing folders...');
    const folders = await cloudinary.api.root_folders();
    console.log('Folders:', folders.folders.map(f => f.name).join(', ') || 'No folders yet');
    console.log('\n');
    
    console.log('🎉 All tests passed! Cloudinary is configured correctly.');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed!');
    console.error('Error:', error.message);
    
    if (error.error && error.error.message) {
      console.error('Details:', error.error.message);
    }
    
    console.log('\n');
    console.log('💡 Common issues:');
    console.log('1. Check if Cloud Name is correct');
    console.log('2. Check if API Key is correct');
    console.log('3. Check if API Secret is correct');
    console.log('4. Make sure credentials are from the same Cloudinary account');
    console.log('5. Check if .env file is loaded properly');
  }
}

testCloudinary();
