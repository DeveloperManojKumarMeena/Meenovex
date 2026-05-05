const mongoose = require('mongoose')

const userinfo = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullName:{
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        }
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
        minlength: 6,
        select: false
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