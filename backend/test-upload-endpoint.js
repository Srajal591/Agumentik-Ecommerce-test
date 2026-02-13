require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUploadEndpoint() {
  try {
    console.log('🧪 Testing Upload Endpoint...\n');

    // First, login as admin to get token
    console.log('1️⃣  Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/admin/login', {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    if (!loginResponse.data.success) {
      console.error('❌ Login failed');
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('✅ Login successful\n');

    // Create a test image file (1x1 pixel PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    // Create form data
    const formData = new FormData();
    formData.append('image', testImageBuffer, {
      filename: 'test.png',
      contentType: 'image/png',
    });
    formData.append('folder', 'categories');

    console.log('2️⃣  Uploading test image...');
    const uploadResponse = await axios.post(
      'http://localhost:5000/api/upload/single',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('✅ Upload successful!\n');
    console.log('Response:', JSON.stringify(uploadResponse.data, null, 2));
    console.log('\n');

    if (uploadResponse.data.success && uploadResponse.data.data.url) {
      console.log('🎉 Upload endpoint is working correctly!');
      console.log('Image URL:', uploadResponse.data.data.url);
    } else {
      console.log('⚠️  Upload response structure is unexpected');
    }

  } catch (error) {
    console.error('❌ Test failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testUploadEndpoint();
