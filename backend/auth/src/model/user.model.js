const mongoose = require('mongoose')

const userinfo = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: {
        type: String,
        enum: ['user', 'admin', 'seller'],
        default: 'user'
    },
    address:[{
        country: String,
        state: String,
        city: String,
        postalCode: String,
        street: String
    }] 
}, { timestamps: true })

const User = mongoose.model('User', userinfo)

module.exports = User;