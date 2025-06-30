require('dotenv').config();
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2d',
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create token
    const token = createToken(user._id, user.role);

    // Return user info without password
    const { password: _, ...userData } = user.toObject();
    res.status(200).json({
      message: 'User logged in successfully',
      token,
      user: userData,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check for existing user
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password should be at least 8 characters long',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (default role: user)
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'user', // or 'admin' manually in DB if needed
    });

    // Create token
    const token = createToken(user._id, user.role);

    // Return user data
    const { password: _, ...userData } = user.toObject();
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userData,
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
