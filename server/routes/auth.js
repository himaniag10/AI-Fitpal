const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/signup', async (req, res) => {
    const { name, username, email, password, confirmPassword } = req.body;
    
    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    
    if (confirmPassword && password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }
    
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or Username already exists' });
        }
        
        const newUser = new User({
            name,
            username,
            email: email.trim().toLowerCase(),
            password: password.trim()
        });
        
        const savedUser = await newUser.save();

        const token = jwt.sign(
            {
                id: savedUser._id,
                email: savedUser.email,
                username: savedUser.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(201).json({ 
            message: 'User registered successfully',
            userId: savedUser._id,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        email = email.trim().toLowerCase();
        password = password.trim();
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                username: user.username 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token,
            userId: user._id,
            name: user.name,
            username: user.username,
            isDetailsComplete: user.isDetailsComplete
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/update-details', async (req, res) => {
    try {
        console.log("Headers:", req.headers);

        const token = req.headers.authorization?.split(' ')[1];
        console.log("Token:", token); 
        console.log('Using JWT_SECRET:', process.env.JWT_SECRET);
        if (!token) {
            console.error("Error: Token not provided");
            return res.status(401).json({ message: 'Unauthorized: Token not provided' });
        }

        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            console.log("Decoded Token:", decoded);
            userId = decoded.id;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                console.error("Error: Token expired");
                return res.status(401).json({ 
                    message: 'Your session has expired. Please log in again.'
                });
            }
            console.error("Error: Invalid token", error.message);
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        console.log("Request Body:", req.body);

        const { age, height, weight, fitnessLevel, dietaryPreferences, goals, gender, allergies } = req.body;

        const user = await User.findById(userId);
        console.log("User Found:", user);

        if (!user) {
            console.error("Error: User not found");
            return res.status(404).json({ message: 'User not found' });
        }

        if (height && !/^(\d+)'(\d+)"?$/.test(height)) {
            console.error("Error: Invalid height format");
            return res.status(400).json({ message: 'Height must be in the format: 5\'10"' });
        }

        if (age) user.age = age;
        if (height) user.height = height;
        if (weight) user.weight = weight;
        if (fitnessLevel) user.fitnessLevel = fitnessLevel;
        if (dietaryPreferences) user.dietaryPreferences = dietaryPreferences;
        if (goals) user.goals = goals;
        if (gender) user.gender = gender;
        if (allergies) user.allergies = allergies;

        if (age && height && weight && fitnessLevel && dietaryPreferences && goals && gender && allergies) {
            user.isDetailsComplete = true;
        }

        await user.save();
        console.log("User Details Updated:", user);

        res.json({
            message: 'Details updated successfully',
            userId: user._id,
            isDetailsComplete: user.isDetailsComplete,
        });
    } catch (error) {
        console.error("Server Error:", error.message); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id; 
      const user = await User.findById(userId).select('-password'); 
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports = router;