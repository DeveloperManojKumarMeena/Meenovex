const mongoose = require('mongoose')

const connectToDb = async()=>{
    try {
        mongoose.connect('mongodb://localhost:27017/authdb')
        console.log('connected to db')
    } catch (error) {
        console.error('Error connecting to db:', error)
    }
}

module.exports = connectToDb;