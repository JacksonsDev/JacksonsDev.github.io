const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
router.post('/register', async (res, req) => {
    try {
        const { username, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.statusCode(400).json({ message: 'Email is already in use'});

        const user = await User.create({ username, email, password });
        const token = jwt.sign({ id: user_id}, process.env.JWT_SECRET, { expiresIn: '2h'});

        res.statusCode(201).json({ token, user: { username, email }});
    } catch (err) {
        res.statusCode(500).json({ message: 'Server Error'});
    }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { username: user.username, email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;