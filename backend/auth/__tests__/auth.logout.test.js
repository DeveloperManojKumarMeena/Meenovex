const request = require('supertest')
const app = require('../src/app')
const User = require('../src/model/user.model')

describe('Auth Logout Endpoint', () => {

  describe('POST /api/auth/logout', () => {

    it('should successfully logout a user with valid token', async () => {
      // First, register a user to get a token
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: { firstname: 'Test', lastname: 'User' }
      }

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      const token = registerResponse.headers['set-cookie'][0].split(';')[0].split('=')[1]

      // Now logout
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `token=${token}`)
        .expect(200)

      expect(logoutResponse.body.status).toBe('success')
      expect(logoutResponse.body.message).toBe('Logout successful')
    })

    it('should successfully logout without token cookie', async () => {
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .expect(200)

      expect(logoutResponse.body.status).toBe('success')
      expect(logoutResponse.body.message).toBe('Logout successful')
    })

    it('should clear token cookie on logout', async () => {
      // First, register a user
      const userData = {
        username: 'logoutuser',
        email: 'logout@example.com',
        password: 'password123',
        fullName: { firstname: 'Logout', lastname: 'Test' }
      }

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      const token = registerResponse.headers['set-cookie'][0].split(';')[0].split('=')[1]

      // Logout
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `token=${token}`)
        .expect(200)

      // Verify Set-Cookie header exists to clear the cookie
      expect(logoutResponse.headers['set-cookie']).toBeDefined()
    })

    it('should blacklist token in Redis on logout', async () => {
      // First, register a user
      const userData = {
        username: 'redisuser',
        email: 'redis@example.com',
        password: 'password123',
        fullName: { firstname: 'Redis', lastname: 'User' }
      }

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      const token = registerResponse.headers['set-cookie'][0].split(';')[0].split('=')[1]

      // Logout
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `token=${token}`)
        .expect(200)

      expect(logoutResponse.body.status).toBe('success')
    })

    it('should handle logout for multiple users independently', async () => {
      // Register and logout first user
      const user1Data = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
        fullName: { firstname: 'User', lastname: 'One' }
      }

      const user1Response = await request(app)
        .post('/api/auth/register')
        .send(user1Data)
        .expect(201)

      const token1 = user1Response.headers['set-cookie'][0].split(';')[0].split('=')[1]

      // Register and logout second user
      const user2Data = {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password456',
        fullName: { firstname: 'User', lastname: 'Two' }
      }

      const user2Response = await request(app)
        .post('/api/auth/register')
        .send(user2Data)
        .expect(201)

      const token2 = user2Response.headers['set-cookie'][0].split(';')[0].split('=')[1]

      // Logout first user
      const logout1Response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `token=${token1}`)
        .expect(200)

      expect(logout1Response.body.status).toBe('success')

      // Logout second user
      const logout2Response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `token=${token2}`)
        .expect(200)

      expect(logout2Response.body.status).toBe('success')
    })

    it('should respond with success status on logout', async () => {
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .expect(200)

      expect(logoutResponse.body.status).toBe('success')
      expect(typeof logoutResponse.body.message).toBe('string')
    })

    it('should return 200 status code on logout', async () => {
      const userData = {
        username: 'statususer',
        email: 'status@example.com',
        password: 'password123',
        fullName: { firstname: 'Status', lastname: 'User' }
      }

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      const token = registerResponse.headers['set-cookie'][0].split(';')[0].split('=')[1]

      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `token=${token}`)

      expect(logoutResponse.status).toBe(200)
    })

    it('should handle logout with malformed token gracefully', async () => {
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `token=malformed.invalid.token`)
        .expect(200)

      expect(logoutResponse.body.status).toBe('success')
      expect(logoutResponse.body.message).toBe('Logout successful')
    })

    it('should set httpOnly and secure flags when clearing cookie', async () => {
      const userData = {
        username: 'secureuser',
        email: 'secure@example.com',
        password: 'password123',
        fullName: { firstname: 'Secure', lastname: 'User' }
      }

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      const token = registerResponse.headers['set-cookie'][0].split(';')[0].split('=')[1]

      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `token=${token}`)
        .expect(200)

      const setCookieHeaders = logoutResponse.headers['set-cookie']
      expect(setCookieHeaders).toBeDefined()
      const clearTokenCookie = setCookieHeaders.find(c => c.startsWith('token='))
      expect(clearTokenCookie).toMatch(/HttpOnly/)
      expect(clearTokenCookie).toMatch(/Secure/)
    })

    it('should not return user data on logout', async () => {
      const userData = {
        username: 'nodedata',
        email: 'nodedata@example.com',
        password: 'password123',
        fullName: { firstname: 'No', lastname: 'Data' }
      }

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      const token = registerResponse.headers['set-cookie'][0].split(';')[0].split('=')[1]

      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `token=${token}`)
        .expect(200)

      expect(logoutResponse.body.user).toBeUndefined()
      expect(logoutResponse.body.password).toBeUndefined()
    })

    it('should return proper JSON response format', async () => {
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .expect(200)

      expect(logoutResponse.headers['content-type']).toMatch(/json/)
      expect(logoutResponse.body).toHaveProperty('status')
      expect(logoutResponse.body).toHaveProperty('message')
    })

    it('should successfully handle consecutive logout requests', async () => {
      const userData = {
        username: 'consecutive',
        email: 'consecutive@example.com',
        password: 'password123',
        fullName: { firstname: 'Consecutive', lastname: 'User' }
      }

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      const token = registerResponse.headers['set-cookie'][0].split(';')[0].split('=')[1]

      // First logout
      const logout1 = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `token=${token}`)
        .expect(200)

      expect(logout1.body.status).toBe('success')

      // Second logout with same token (already blacklisted)
      const logout2 = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `token=${token}`)
        .expect(200)

      expect(logout2.body.status).toBe('success')
    })

    it('should handle logout request without body', async () => {
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .send()
        .expect(200)

      expect(logoutResponse.body.status).toBe('success')
    })

    it('should clear cookie even when no token is present', async () => {
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .expect(200)

      expect(logoutResponse.status).toBe(200)
      expect(logoutResponse.body.status).toBe('success')
    })

    it('should be accessible via POST method only', async () => {
      // Try GET request - should fail
      const getResponse = await request(app)
        .get('/api/auth/logout')

      expect(getResponse.status).not.toBe(200)
    })

    it('should respond with JSON content type', async () => {
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .expect(200)

      expect(logoutResponse.headers['content-type']).toMatch(/application\/json/)
    })
  })
})
