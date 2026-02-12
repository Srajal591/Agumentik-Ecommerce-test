// Test if backend is accessible from the network
const axios = require('axios');

const testConnection = async () => {
  const urls = [
    'http://localhost:5000/api/auth/user/register',
    'http://127.0.0.1:5000/api/auth/user/register',
    'http://192.168.31.48:5000/api/auth/user/register',
    'http://10.0.2.2:5000/api/auth/user/register'
  ];

  console.log('🧪 Testing backend connectivity...\n');

  for (const url of urls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await axios.post(url, {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        mobile: `98765${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`
      }, {
        timeout: 5000
      });
      
      console.log(`✅ SUCCESS! ${url} is working!\n`);
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ Connection refused - Backend not accessible at this URL\n`);
      } else if (error.code === 'ETIMEDOUT') {
        console.log(`❌ Timeout - Firewall might be blocking this URL\n`);
      } else if (error.response) {
        console.log(`✅ Backend is accessible! (Got response: ${error.response.status})\n`);
      } else {
        console.log(`❌ Error: ${error.message}\n`);
      }
    }
  }

  console.log('\n📝 Recommendation:');
  console.log('Use the URL that shows ✅ SUCCESS in your frontend config');
  console.log('Update: user-frontend/src/config/api.js');
};

testConnection();
