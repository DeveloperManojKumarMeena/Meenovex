const mongoose = require('mongoose')

const connectToDb = async()=>{
    try {
       await mongoose.connect(process.env.MONGOOSE_URI)
        console.log('✅ Database connected successfully')
    } catch (error) {
        console.error('❌ Error connecting to db:', error)
    }
}

module.exports = connectToDb;