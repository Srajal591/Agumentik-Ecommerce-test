const nodemailer = require('nodemailer');

// Check if we should use console logging instead of email (for development)
const USE_CONSOLE_OTP = process.env.USE_CONSOLE_OTP === 'true';

// Create transporter using Gmail (free)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password, not regular password
    },
  });
};

/**
 * Send OTP email
 */
const sendOTPEmail = async (email, otp, name = 'User') => {
  try {
    // Development mode: Log OTP to console instead of sending email
    if (USE_CONSOLE_OTP) {
      console.log('\n' + '='.repeat(70));
      console.log('🔥🔥🔥 EMAIL OTP (CONSOLE MODE) 🔥🔥🔥');
      console.log('='.repeat(70));
      console.log(`📧 To: ${email}`);
      console.log(`👤 Name: ${name}`);
      console.log('');
      console.log('🔑 YOUR OTP CODE IS:');
      console.log('');
      console.log(`     >>>  ${otp}  <<<`);
      console.log('');
      console.log(`⏰ Valid for: ${process.env.OTP_EXPIRY_MINUTES || 10} minutes`);
      console.log('='.repeat(70));
      console.log('⚠️  IMPORTANT: Enter THIS OTP in the app, not any old OTP!');
      console.log('='.repeat(70) + '\n');
      return { success: true, messageId: 'console-mode', mode: 'console' };
    }

    // Production mode: Send actual email
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Fashion Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Fashion Store Login',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #704F38 0%, #5C3F2E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #704F38; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #704F38; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { background: #704F38; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛍️ Fashion Store</h1>
              <p>Your Premium E-Commerce Platform</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>You requested to login to your Fashion Store account. Use the OTP below to complete your login:</p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes</p>
              </div>
              
              <p><strong>Security Tips:</strong></p>
              <ul>
                <li>Never share this OTP with anyone</li>
                <li>Fashion Store will never ask for your OTP</li>
                <li>This OTP expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes</li>
              </ul>
              
              <p>If you didn't request this OTP, please ignore this email or contact our support team.</p>
            </div>
            <div class="footer">
              <p>© 2024 Fashion Store. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId, mode: 'email' };
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (email, name) => {
  try {
    // Development mode: Log to console instead of sending email
    if (USE_CONSOLE_OTP) {
      console.log('\n' + '='.repeat(60));
      console.log('📧 WELCOME EMAIL (CONSOLE MODE)');
      console.log('='.repeat(60));
      console.log(`To: ${email}`);
      console.log(`Name: ${name}`);
      console.log(`Message: Welcome to Fashion Store!`);
      console.log('='.repeat(60) + '\n');
      return { success: true, messageId: 'console-mode', mode: 'console' };
    }

    // Production mode: Send actual email
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Fashion Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Fashion Store! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #704F38 0%, #5C3F2E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { background: #704F38; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Fashion Store!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for joining Fashion Store - your premium destination for fashion!</p>
              
              <p><strong>What's next?</strong></p>
              <ul>
                <li>Browse our latest collections</li>
                <li>Add items to your wishlist</li>
                <li>Enjoy exclusive deals and offers</li>
                <li>Track your orders in real-time</li>
              </ul>
              
              <p>Start shopping now and discover amazing fashion!</p>
              
              <p>If you have any questions, our support team is here to help.</p>
            </div>
            <div class="footer">
              <p>© 2024 Fashion Store. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId, mode: 'email' };
  } catch (error) {
    console.error('❌ Welcome email error:', error);
    // Don't throw error for welcome email - it's not critical
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
};
