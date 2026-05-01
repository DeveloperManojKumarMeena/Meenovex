const mongoose = require('mongoose')

const userinfo = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
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
    address: {
        type: String
    },

    timestamps: true

})

const User = mongoose.model('User', userinfo)

module.exports = User;