const { validationResult } = require('express-validator');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendEmail, generateOTP } = require('../utils/emailService');

// Helper function to send token response
const sendTokenResponse = async (user, statusCode, res, message = 'Success') => {
  // Generate tokens
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        profileCompletion: user.profileCompletion
      }
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, role = 'student' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: ['student', 'professional'].includes(role) ? role : 'student'
    });

    // Generate and send OTP for email verification
    const otp = generateOTP(6);
    
    // Save OTP to database
    await OTP.create({
      email,
      otp,
      purpose: 'email_verification'
    });

    // Send verification email
    try {
      await sendEmail(email, 'emailVerification', { otp, name });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with registration even if email fails
    }


    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification code.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check for user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email with OTP
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: 'email_verification',
      isUsed: false
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check if OTP is valid
    if (!otpRecord.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired or exceeded maximum attempts'
      });
    }

    // Find user and verify email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    await user.save();

    // Mark OTP as used
    await otpRecord.markAsUsed();

    sendTokenResponse(user, 200, res, 'Email verified successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res, next) => {
  try {
    const { email, purpose = 'email_verification' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is already verified (for email_verification purpose)
    if (purpose === 'email_verification' && user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Delete any existing unused OTPs for this email and purpose
    await OTP.deleteMany({ email, purpose, isUsed: false });

    // Generate new OTP
    const otp = generateOTP(6);
    
    // Save new OTP
    await OTP.create({
      email,
      otp,
      purpose
    });

    // Send email based on purpose
    const emailTemplates = {
      'email_verification': 'emailVerification',
      'password_reset': 'passwordReset',
      'login_verification': 'loginVerification'
    };

    try {
      await sendEmail(email, emailTemplates[purpose] || 'emailVerification', { otp, name: user.name });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - send reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with this email exists, a password reset code has been sent.'
      });
    }

    // Delete any existing password reset OTPs
    await OTP.deleteMany({ email, purpose: 'password_reset', isUsed: false });

    // Generate OTP
    const otp = generateOTP(6);
    
    // Save OTP
    await OTP.create({
      email,
      otp,
      purpose: 'password_reset'
    });

    // Send password reset email
    try {
      await sendEmail(email, 'passwordReset', { otp, name: user.name });
    } catch (emailError) {
      console.error('Password reset email failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'If an account with this email exists, a password reset code has been sent.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find and validate OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: 'password_reset',
      isUsed: false
    });

    if (!otpRecord || !otpRecord.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password
    user.password = newPassword;
    user.refreshToken = null; // Invalidate existing refresh tokens
    await user.save();

    // Mark OTP as used
    await otpRecord.markAsUsed();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        country: user.country,
        institution: user.institution,
        profession: user.profession,
        profileCompletion: user.profileCompletion,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    const allowedFields = ['name', 'country', 'institution', 'profession', 'role'];
    
    // Only update allowed fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        institution: user.institution,
        profession: user.profession,
        profileCompletion: user.profileCompletion
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh JWT token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res, next) => {
  try {
    const user = req.user; // Set by refreshToken middleware
    
    // Generate new tokens
    const newToken = user.getSignedJwtToken();
    const newRefreshToken = user.getRefreshToken();
    
    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.status(200)
      .cookie('token', newToken, options)
      .json({
        success: true,
        message: 'Token refreshed successfully',
        token: newToken,
        refreshToken: newRefreshToken
      });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    // Clear refresh token from database
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    
    res.status(200)
      .cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      })
      .json({
        success: true,
        message: 'Logged out successfully'
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  refreshToken,
  logout
};