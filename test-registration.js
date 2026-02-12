// Quick test script to verify registration API
// Run with: node test-registration.js

const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('🧪 Testing registration API...\n');
    
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`, // Unique email
      mobile: `98765${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}` // Unique mobile
    };
    
    console.log('📤 Sending request to: http://localhost:5000/api/auth/user/register');
    console.log('📝 Test data:', testUser);
    console.log('');
    
    const response = await axios.post(
      'http://localhost:5000/api/auth/user/register',
      testUser,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ SUCCESS! Registration API is working!\n');
    console.log('📥 Response:', JSON.stringify(response.data, null, 2));
    console.log('');
    console.log('🎉 Backend is ready for frontend testing!');
    
  } catch (error) {
    console.log('❌ ERROR! Registration API failed!\n');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('❌ No response from server. Is the backend running?');
      console.log('💡 Start backend with: cd backend && npm run dev');
    } else {
      console.log('Error:', error.message);
    }
  }
};

testRegistration();
