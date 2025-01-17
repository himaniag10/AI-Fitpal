const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

// User Schema
const userSchema = new mongoose.Schema({
    name: {                     
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
    },
    age: {
        type: Number,
        min: [0, 'Age must be a positive number'],
    },
    height: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^(\d+)'(\d+)"?$/.test(v); 
            },
            message: 'Height must be in the format: 5\'10"',
        },
    },
    weight: {
        type: Number,
        min: [0, 'Weight must be a positive number'],
    },
    fitnessLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    dietaryPreferences: {
        type: [String], 
    },
    goals: {
        type: [String], 
    },
    gender: { type: String, enum: ["Male", "Female", "Other"] }, 
    allergies: { type: String },
    isDetailsComplete: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
        this.password = hashedPassword;
    }
    next();
});

userSchema.statics.findByEmail = async function (email) {
    return this.findOne({ email: email.trim() });
};

module.exports = mongoose.model('User', userSchema);
