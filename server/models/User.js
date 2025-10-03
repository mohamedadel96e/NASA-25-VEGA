const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['student', 'professional', 'admin'], // Currently There only two roles but in future we will add admin with a specific admin panel
    default: 'student'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Profile fields (Not required)
  country: {
    type: String,
    maxlength: [50, 'Country cannot exceed 50 characters']
  },
  institution: {
    type: String,
    maxlength: [100, 'Institution cannot exceed 100 characters']
  },
  profession: {
    type: String,
    maxlength: [100, 'Profession cannot exceed 100 characters']
  },
  
  // Account status (only admin should be able to change this in the future via admin panel)
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  
  // Refresh token for JWT
  refreshToken: {
    type: String,
    default: null
  },
  
  // Reset password fields
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ oauthProvider: 1, oauthId: 1 });
userSchema.index({ createdAt: 1 });

// Virtual for full profile completion
userSchema.virtual('profileCompletion').get(function() {
  let completion = 0;
  const fields = ['name', 'email', 'country', 'institution'];
  
  fields.forEach(field => {
    if (this[field]) completion += 25;
  });
  
  return completion;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10); 
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// Generate Refresh Token
userSchema.methods.getRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE
    }
  );
};

// Generate Reset Password Token (Just something not used currently but might be useful in future)
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = require('crypto').randomBytes(20).toString('hex');
  
  this.resetPasswordToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);