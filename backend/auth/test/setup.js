const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer

// Set environment variable for JWT_SECRET
process.env.JWT_SECRET = 'test-secret-key-for-testing'

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  
  // Connect Mongoose to the in-memory database
  await mongoose.connect(mongoUri)
}, 60000) // Increased timeout to 60 seconds for MongoDB setup

afterAll(async () => {
  // Cleanup
  if (mongoose.connection) {
    await mongoose.disconnect()
  }
  if (mongoServer) {
    await mongoServer.stop()
  }
})

afterEach(async () => {
  // Clear all collections after each test
  if (mongoose.connection && mongoose.connection.db) {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray()
      
      for (let collection of collections) {
        await mongoose.connection.db.dropCollection(collection.name)
      }
    } catch (error) {
      console.log('Cleanup error:', error)
    }
  }
})

