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
        fullName: { firstname: 'Test', lastname: 'User' }
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('User registered successfully')
      expect(response.body.user).toHaveProperty('_id')
      expect(response.body.user.username).toBe(userData.username)
      expect(response.body.user.email).toBe(userData.email)
      expect(response.body.user.role).toBe('user') // default role

      // Verify user is saved in database
      const savedUser = await User.findById(response.body.user._id)
      expect(savedUser).toBeDefined()
      expect(savedUser.username).toBe(userData.username)
      expect(savedUser.email).toBe(userData.email)
      expect(savedUser.fullName.firstname).toBe(userData.fullName.firstname)
      expect(savedUser.fullName.lastname).toBe(userData.fullName.lastname)
    })

    it('should register a user with custom role', async () => {
      const userData = {
        username: 'selleruser',
        email: 'seller@example.com',
        password: 'password123',
        fullName: { firstname: 'Seller', lastname: 'User' },
        role: 'seller',
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('User registered successfully')
      expect(response.body.user.role).toBe('seller')
    })

    it('should fail if email is missing', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        fullName: { firstname: 'Test', lastname: 'User' }
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
      expect(response.body.errors).toBeDefined()
      expect(Array.isArray(response.body.errors)).toBe(true)
    })

    it('should fail if username is missing', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: { firstname: 'Test', lastname: 'User' }
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should fail if password is missing', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        fullName: { firstname: 'Test', lastname: 'User' }
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should fail if fullName is missing', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should fail if firstname is missing from fullName', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: { lastname: 'User' }
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should fail if lastname is missing from fullName', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: { firstname: 'Test' }
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should fail if password is less than 6 characters', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123',
        fullName: { firstname: 'Test', lastname: 'User' }
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should fail if username is less than 3 characters', async () => {
      const userData = {
        username: 'ab',
        email: 'test@example.com',
        password: 'password123',
        fullName: { firstname: 'Test', lastname: 'User' }
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should fail if email is invalid', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123',
        fullName: { firstname: 'Test', lastname: 'User' }
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should fail if username already exists', async () => {
      const userData = {
        username: 'existinguser',
        email: 'user1@example.com',
        fullName: { firstname: 'Existing', lastname: 'User' },
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
          fullName: { firstname: 'Different', lastname: 'User' }
        })
        .expect(409)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('User with this email or username already exists')
    })

    it('should fail if email already exists', async () => {
      const userData = {
        username: 'user1',
        email: 'existing@example.com',
        fullName: { firstname: 'Existing', lastname: 'User' },
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
          username: 'user2',
          email: userData.email,
          password: 'password456',
          fullName: { firstname: 'Different', lastname: 'User' }
        })
        .expect(409)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('User with this email or username already exists')
    })

    it('should fail if invalid role is provided', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: { firstname: 'Test', lastname: 'User' },
        role: 'invalidrole'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should set cookie with token on successful registration', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: { firstname: 'Test', lastname: 'User' }
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.headers['set-cookie']).toBeDefined()
      const cookieHeader = response.headers['set-cookie'].find(cookie => cookie.startsWith('token='))
      expect(cookieHeader).toBeDefined()
    })

    it('should register multiple users without conflicts', async () => {
      const users = [
        {
          username: 'user1',
          email: 'user1@example.com',
          password: 'password123',
          fullName: { firstname: 'User', lastname: 'One' }
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          password: 'password456',
          fullName: { firstname: 'User', lastname: 'Two' }
        },
        {
          username: 'user3',
          email: 'user3@example.com',
          password: 'password789',
          fullName: { firstname: 'User', lastname: 'Three' }
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
        fullName: { firstname: 'Test', lastname: 'User' }
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      const savedUser = await User.findById(response.body.user._id)
      expect(savedUser.email).toBe('test@example.com')
    })
  })
})
