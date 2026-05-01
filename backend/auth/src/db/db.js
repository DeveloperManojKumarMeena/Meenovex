const mongoose = require('mongoose')

const connectToDb = async()=>{
    try {
       await mongoose.connect('mongodb://localhost:27017/authdb')
        console.log('✅ Database connected successfully')
    } catch (error) {
        console.error('❌ Error connecting to db:', error)
    }
}

module.exports = connectToDb;