const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./tests_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('When there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the first blog is about React patterns', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].title).toBe('React patterns')
  })

  test('unique identifier is named "id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  let sandbox = {}

  beforeAll(async () => {
    await User.deleteMany({})

    await api
      .post('/api/users')
      .send({ username: 'root', name: 'bob', password: 'sekret' })

    const user = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    sandbox.user = user.body
  })

  test('succeeds with valid data', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${sandbox.user.token}`)
      .send(helper.listWithOneBlog[0])
      .expect(201)
      .expect('Content-type', /application\/json/)

    const users = await api
      .get('/api/users')

    const user = users.body.find(u => u.username === 'root')
    expect(user.blogs).toHaveLength(1)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain('A new blog post')
  })

  test('blog without likes has likes set to 0', async () => {
    const newBlog = {
      title: 'This is a blog post without any likes',
      author: 'A very unlikeable chap',
      url: 'http://example.com/unlikeable-blog-post',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${sandbox.user.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'A very unlikeable chap',
      url: 'http://example.com/unlikeable-blog-post',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${sandbox.user.token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'This is a blog post without any likes',
      author: 'A very unlikeable chap',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${sandbox.user.token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  const sandbox = {}

  beforeAll(async () => {
    await User.deleteMany({})

    await api
      .post('/api/users')
      .send({ username: 'root', name: 'bob', password: 'sekret' })

    const user = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    sandbox.user = user.body
  })

  test('succeeds with status code 204 if id is valid', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${sandbox.user.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
  })

  test('fails with status code 401 if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})


afterAll(() => {
  console.log('closing connection')
  mongoose.connection.close()
})