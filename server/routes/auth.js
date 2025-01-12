const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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
        
        res.status(201).json({ 
            message: 'User registered successfully',
            userId: savedUser._id
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
            JWT_SECRET,
            { expiresIn: '1h' }
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
        const { userId, age, height, weight, fitnessLevel, dietaryPreferences, goals } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (height && !/^(\d+)'(\d+)"?$/.test(height)) {
            return res.status(400).json({ message: 'Height must be in the format: 5\'10"' });
        }

        if (age) user.age = age;
        if (height) user.height = height;
        if (weight) user.weight = weight;
        if (fitnessLevel) user.fitnessLevel = fitnessLevel;
        if (dietaryPreferences) user.dietaryPreferences = dietaryPreferences;
        if (goals) user.goals = goals;

        if (age && height && weight && fitnessLevel && dietaryPreferences && goals) {
            user.isDetailsComplete = true;
        }

        await user.save();

        res.json({
            message: 'Details updated successfully',
            userId: user._id,
            isDetailsComplete: user.isDetailsComplete
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;