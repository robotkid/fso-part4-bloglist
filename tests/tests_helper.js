const Blog = require('../models/blog')
const { listWithOneBlog, blogs: initialBlogs } = require('./testData')

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'willremove', url: 'http://willremove' })
  await blog.save()
  await blog.remove()

  return blog.id
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  listWithOneBlog, initialBlogs, nonExistingId, blogsInDb
}
