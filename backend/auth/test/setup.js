const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer

// Set environment variable for JWT_SECRET
process.env.JWT_SECRET = 'test-secret-key-for-testing'
process.env.REDIS_HOST = 'localhost'
process.env.REDIS_PORT = 6379

// Mock Redis for testing
jest.mock('../src/db/redis', () => {
  return {
    set: jest.fn((key, value, ...args) => Promise.resolve('OK')),
    get: jest.fn((key) => Promise.resolve(null)),
    del: jest.fn((key) => Promise.resolve(1)),
    on: jest.fn(),
  }
})

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

