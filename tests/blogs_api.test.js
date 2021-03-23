const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./tests_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  for await (let b of helper.initialBlogs) {
    const blogObject = new Blog(b)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are six blogs', async () => {
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

test('post new blog works correctly', async () => {
  await api
    .post('/api/blogs')
    .send(helper.listWithOneBlog[0])
    .expect(201)
    .expect('Content-type', /application\/json/)

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
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
  console.log('closing connection')
  mongoose.connection.close()
})