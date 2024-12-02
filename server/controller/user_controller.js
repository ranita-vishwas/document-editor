import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schema/userSchema.js';

// Signup Controller
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // Set cookie
        res.cookie('Document_Editor', token, { httpOnly: true });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Logout Controller
export const logout = async (req, res) => {
    try {
        res.clearCookie('Document_Editor');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
