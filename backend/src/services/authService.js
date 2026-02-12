const User = require('../models/User');
const OTP = require('../models/OTP');
const generateToken = require('../utils/generateToken');
const generateOTP = require('../utils/generateOTP');
const { sendOTPEmail, sendWelcomeEmail } = require('../utils/emailService');

class AuthService {
  // Admin login
  async adminLogin(email, password) {
    const user = await User.findOne({ email, role: 'admin', isDeleted: false });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.isBlocked) {
      throw new Error('Your account has been blocked');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Send OTP to user mobile
  async sendOTP(mobile) {
    // Generate OTP
    const otpCode = generateOTP(parseInt(process.env.OTP_LENGTH) || 6);

    // Calculate expiry time
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Delete any existing OTPs for this mobile
    await OTP.deleteMany({ mobile });

    // Save new OTP
    const otp = await OTP.create({
      mobile,
      otp: otpCode,
      expiresAt,
    });

    // In production, send OTP via SMS service
    console.log(`📱 OTP for ${mobile}: ${otpCode}`);

    return {
      message: 'OTP sent successfully',
      expiresAt,
      // For development only - remove in production
      otp: process.env.NODE_ENV === 'development' ? otpCode : undefined,
    };
  }

  // Verify OTP and login user
  async verifyOTP(mobile, otpCode) {
    const otpRecord = await OTP.findOne({
      mobile,
      verified: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      throw new Error('Invalid or expired OTP');
    }

    const isOTPValid = await otpRecord.compareOTP(otpCode);
    if (!isOTPValid) {
      throw new Error('Invalid OTP');
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Find or create user
    let user = await User.findOne({ mobile, isDeleted: false });

    if (!user) {
      user = await User.create({
        mobile,
        role: 'user',
      });
    }

    if (user.isBlocked) {
      throw new Error('Your account has been blocked');
    }

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Send OTP to user email
  async sendEmailOTP(email) {
    // Check if user exists
    const user = await User.findOne({ email, isDeleted: false });
    
    if (!user) {
      throw new Error('No account found with this email');
    }

    if (user.isBlocked) {
      throw new Error('Your account has been blocked');
    }

    // Generate OTP
    const otpCode = generateOTP(parseInt(process.env.OTP_LENGTH) || 6);

    // Calculate expiry time
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({
      email,
      otp: otpCode,
      expiresAt,
    });

    // Send OTP via email (or log to console in dev mode)
    await sendOTPEmail(email, otpCode, user.name || 'User');

    console.log('\n💡 IMPORTANT: Use this FRESH OTP:', otpCode);
    console.log('This OTP is stored as plain text (not hashed) in development mode.\n');

    return {
      message: 'OTP sent to your email successfully',
      expiresAt,
      // For development only - remove in production
      otp: process.env.NODE_ENV === 'development' ? otpCode : undefined,
    };
  }

  // Verify email OTP and login user
  async verifyEmailOTP(email, otpCode) {
    console.log('\n🔍 Verifying Email OTP in Service:');
    console.log('Email:', email);
    console.log('OTP Code:', otpCode);
    console.log('OTP Code Type:', typeof otpCode);
    console.log('OTP Code as String:', String(otpCode));

    const otpRecord = await OTP.findOne({
      email,
      verified: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    console.log('OTP Record found:', otpRecord ? 'Yes' : 'No');
    if (otpRecord) {
      console.log('OTP Record Email:', otpRecord.email);
      console.log('OTP Record Verified:', otpRecord.verified);
      console.log('OTP Record Expires At:', otpRecord.expiresAt);
      console.log('Current Time:', new Date());
      console.log('OTP Record Hashed OTP:', otpRecord.otp);
    }

    if (!otpRecord) {
      throw new Error('Invalid or expired OTP');
    }

    console.log('Comparing OTP...');
    console.log('Candidate OTP (plain):', otpCode);
    console.log('Stored OTP (hashed):', otpRecord.otp);
    
    const isOTPValid = await otpRecord.compareOTP(String(otpCode));
    console.log('OTP Valid:', isOTPValid);

    if (!isOTPValid) {
      // Try comparing as string explicitly
      console.log('Trying comparison with explicit string conversion...');
      const isOTPValidString = await otpRecord.compareOTP(otpCode.toString());
      console.log('OTP Valid (string):', isOTPValidString);
      
      if (!isOTPValidString) {
        throw new Error('Invalid OTP');
      }
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Find user
    const user = await User.findOne({ email, isDeleted: false });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isBlocked) {
      throw new Error('Your account has been blocked');
    }

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Register new user
  async registerUser(data) {
    const { name, email, mobile } = data;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
      isDeleted: false,
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already registered');
      }
      if (existingUser.mobile === mobile) {
        throw new Error('Mobile number already registered');
      }
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      mobile,
      role: 'user',
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name).catch(err => 
      console.error('Welcome email failed:', err)
    );

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
      },
    };
  }
}

module.exports = new AuthService();
