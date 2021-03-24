const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

test('Login with correct credentials should work', async () => {
  const newUser = {
    username: 'root',
    name: 'bob',
    password: 'sekret'
  }

  await api
    .post('/api/users')
    .send(newUser)

  const result = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })
    .expect(200)

  expect(result.body).toHaveProperty('token')
})

afterAll(() => {
  mongoose.connection.close()
})