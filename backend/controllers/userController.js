require('dotenv').config();
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

// Create JWT token
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2d',
  });
};

// Login Controller
const loginUser = async (req, res) => {
  // Validate request body
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email and password are required' 
    });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Create token
    const token = createToken(user._id, user.role);

    // Return user info without password
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Registration Controller
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format' 
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Check for existing user
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'user' // Default role
    });

    // Create token
    const token = createToken(user._id, user.role);

    // Return user data without password
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  loginUser,
  registerUser
};