const User = require('../model/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User.findOne({$or: [{ email }, { username }]});
        
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

       
        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

      const cookie = jwt.sign({ _id:newUser._id, email, username }, process.env.JWT_SECRET);

        res.cookie('token', cookie, { httpOnly: true });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    registerUser
}