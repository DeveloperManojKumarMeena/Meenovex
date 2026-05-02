const User = require('../model/user.model')

const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, and password are required'
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email or username already exists'
            })
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password, // In production, hash the password
            role: role || 'user'
        })

        const savedUser = await newUser.save()

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role
            }
        })
    } catch (error) {
        console.error('Register error:', error)
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        })
    }
}

module.exports = {
    registerUser
}