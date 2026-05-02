const request = require('supertest')
const app = require('../src/app')
const User = require('../src/model/user.model')

describe('Auth Register Endpoint', () => {
  
  describe('POST /api/auth/register', () => {
    
    it('should successfully register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('User registered successfully')
      expect(response.body.user).toHaveProperty('id')
      expect(response.body.user.username).toBe(userData.username)
      expect(response.body.user.email).toBe(userData.email)
      expect(response.body.user.role).toBe('user') // default role

      // Verify user is saved in database
      const savedUser = await User.findById(response.body.user.id)
      expect(savedUser).toBeDefined()
      expect(savedUser.username).toBe(userData.username)
      expect(savedUser.email).toBe(userData.email)
    })

    it('should register a user with custom role', async () => {
      const userData = {
        username: 'selleruser',
        email: 'seller@example.com',
        password: 'password123',
        role: 'seller',
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.user.role).toBe('seller')
    })

    it('should fail if required fields are missing', async () => {
      const testCases = [
        { email: 'test@example.com', password: 'password123' }, // missing username
        { username: 'testuser', password: 'password123' }, // missing email
        { username: 'testuser', email: 'test@example.com' }, // missing password
        {}, // all missing
      ]

      for (const userData of testCases) {
        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe('Username, email, and password are required')
      }
    })

    it('should fail if username already exists', async () => {
      const userData = {
        username: 'existinguser',
        email: 'user1@example.com',
        password: 'password123',
      }

      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      // Try to register with same username
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: userData.username,
          email: 'different@example.com',
          password: 'password456',
        })
        .expect(409)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('User with this email or username already exists')
    })

    it('should fail if email already exists', async () => {
      const userData = {
        username: 'user1',
        email: 'existing@example.com',
        password: 'password123',
      }

      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'differentuser',
          email: userData.email,
          password: 'password456',
        })
        .expect(409)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('User with this email or username already exists')
    })

    it('should handle database errors gracefully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }

      // Spy on User.findOne to simulate database error
      jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Database error'))

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(500)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Error registering user')
      expect(response.body.error).toBeDefined()

      User.findOne.mockRestore()
    })

    it('should register multiple users without conflicts', async () => {
      const users = [
        {
          username: 'user1',
          email: 'user1@example.com',
          password: 'password123',
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          password: 'password456',
        },
        {
          username: 'user3',
          email: 'user3@example.com',
          password: 'password789',
        },
      ]

      for (const userData of users) {
        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(201)

        expect(response.body.success).toBe(true)
        expect(response.body.user.username).toBe(userData.username)
      }

      // Verify all users are in database
      const allUsers = await User.find({})
      expect(allUsers).toHaveLength(3)
    })

    it('should store email in lowercase', async () => {
      const userData = {
        username: 'testuser',
        email: 'Test@Example.COM',
        password: 'password123',
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      const savedUser = await User.findById(response.body.user.id)
      expect(savedUser.email).toBe('test@example.com')
    })
  })
})
