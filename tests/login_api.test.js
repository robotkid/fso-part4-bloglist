const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

test('Login with correct credentials should work', async () => {
  const result = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)

  expect(result.body).toHaveProperty('token')
})

afterAll(() => {
  console.log('closing connection')
  mongoose.connection.close()
})