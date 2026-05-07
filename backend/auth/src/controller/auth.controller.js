const User = require('../model/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const redisClient = require('../db/redis');
const { default: mongoose } = require('mongoose');

const registerUser = async (req, res) => {
    try {
        const { username, fullName, email, password, role } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User with this email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        // Create new user
        const newUser = await User.create({
            username,
            fullName: {
                firstname: fullName.firstname,
                lastname: fullName.lastname
            },
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        const token = jwt.sign({ _id: newUser._id, email, username }, process.env.JWT_SECRET);

        res.cookie('token', token, { httpOnly: true, maxage: 24 * 60 * 60 * 1000 });

        res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] }).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        const token = jwt.sign({ _id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET);

        res.cookie('token', token, { httpOnly: true, secure: true, maxage: 24 * 60 * 60 * 1000 });

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

const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (token) {
            // Add token to Redis blacklist
            await redisClient.set(token, 'blacklisted', 'EX', 24 * 60 * 60); // Set expiration to 24 hours
        }
        res.clearCookie('token', {
            httpOnly: true,
            secure: true
        });
        res.status(200).json({ status: 'success', message: 'Logout successful' });
    } catch (error) {
        console.error('Error in logoutUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const GetAddress = async (req, res) => {
    try {
        const user = req.user
        const userinfo = await User.findById(user._id)

        if (userinfo.address.length === 0) {

            return res.status(404).json({
                Message: "You not have any address in yours profile so please add address first and fetch it again...",
            })
        }

        res.status(201).json({
            Message: "Address fetch successfully",
            Address: userinfo.address
        })
    } catch (error) {
        console.log('some error from GetAddress => ' + error)
        res.status(500).json({ message: 'GetAddress server fail' });
    }
}

const addAddress = async (req, res) => {
    try {
        const userAddress = req.body.address;
        console.log(req.body.address);
        const user = req.user;
        const userinfo = await User.findById(user._id);

        const updatedUser = await User.findByIdAndUpdate(user._id, { $push: { address: userAddress } }, { returnDocument: 'after' });


        res.status(201).json({
            Message: "Address added successfully",
            Address: updatedUser.address
        })
    } catch (error) {
        console.log('some error from addAddress => ' + error)
        res.status(500).json({ message: 'addAddress server fail' });
    }
}

const deleteAddress = async (req, res) => {
    try {
        const userid = req.user;
        

        const addressId = req.params.id;
       
        console.log('addressId => ' + addressId);

        // Pull the address with the specified ID from the user's address array
        const updatedUser = await User.findByIdAndUpdate({_id: userid._id},
            { $pull: { address: { _id: addressId } } },
            {  returnDocument: 'after' }
        );  

        if (!updatedUser) {
            return res.status(404).json({
                Message: "User not found",
            })
        }   
        res.status(200).json({
            Message: "Address deleted successfully",
        })
    } catch (error) {
        console.log('some error from deleteAddress => ' + error)
        res.status(500).json({ message: 'deleteAddress server fail' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    logoutUser,
    GetAddress,
    addAddress,
    deleteAddress
}