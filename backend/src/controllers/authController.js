const authService = require('../services/authService');

// Admin login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await authService.adminLogin(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Send OTP
exports.sendOTP = async (req, res, next) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required',
      });
    }

    const result = await authService.sendOTP(mobile);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
exports.verifyOTP = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and OTP are required',
      });
    }

    const result = await authService.verifyOTP(mobile, otp);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// Register user
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, mobile } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and mobile number are required',
      });
    }

    const result = await authService.registerUser({ name, email, mobile });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Send email OTP
exports.sendEmailOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const result = await authService.sendEmailOTP(email);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Verify email OTP
exports.verifyEmailOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    console.log('\n📥 Verify Email OTP Request:');
    console.log('Email:', email);
    console.log('OTP:', otp);
    console.log('OTP Type:', typeof otp);
    console.log('OTP Length:', otp?.length);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const result = await authService.verifyEmailOTP(email, otp);

    console.log('✅ Verification successful!');

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: result,
    });
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    next(error);
  }
};

// Logout (client-side token removal, but we can log it)
exports.logout = async (req, res, next) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can log the logout event or implement token blacklisting if needed
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
