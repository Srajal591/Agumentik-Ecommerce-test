require('dotenv').config();
const { sendOTPEmail } = require('./src/utils/emailService');

const testConsoleOTP = async () => {
  console.log('\n🧪 Testing Console OTP Mode...\n');
  console.log('USE_CONSOLE_OTP:', process.env.USE_CONSOLE_OTP);
  
  try {
    const result = await sendOTPEmail(
      'test@example.com',
      '123456',
      'Test User'
    );
    
    console.log('\n✅ Test Result:', result);
    
    if (result.mode === 'console') {
      console.log('\n✅ Console mode is working! OTP was logged above.');
      console.log('📝 You should see a formatted OTP box in the output.');
    } else {
      console.log('\n📧 Email mode is active. Email was sent.');
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
};

testConsoleOTP();
