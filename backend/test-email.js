require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  try {
    console.log('Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Email configuration is valid!');
    
    // Send test email
    const info = await transporter.sendMail({
      from: `"Fashion Store" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self
      subject: 'Test Email from Fashion Store',
      text: 'This is a test email to verify the email configuration.',
      html: '<b>This is a test email to verify the email configuration.</b>',
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Authentication failed. Please check:');
      console.error('1. Email address is correct');
      console.error('2. 2-Factor Authentication is enabled on Gmail');
      console.error('3. App Password is generated at: https://myaccount.google.com/apppasswords');
      console.error('4. App Password is entered without spaces');
    }
  }
};

testEmail();
