const User = require('../model/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const registerUser = async (req, res) => {
    try {
        const { username, fullName, email, password, role } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(409).json({ message: 'User with this email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        // Create new user
        const newUser = await User.create({
            username,
            fullName: {
               firstname: fullName.firstname,
               lastname: fullName. lastname
            },
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        const cookie = jwt.sign({ _id: newUser._id, email, username }, process.env.JWT_SECRET);

        res.cookie('token', cookie, { httpOnly: true,secure: true,maxage: 24 * 60 * 60 * 1000 });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        const token = jwt.sign({ _id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET);

        res.cookie('token', cookie, { httpOnly: true,secure: true,maxage: 24 * 60 * 60 * 1000 });

        res.status(200).json({ message: 'Login successful', user });

    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, username, newPassword } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword
        });

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Server error' });
    }
}



module.exports = {
    registerUser,
    loginUser,
    resetPassword
}