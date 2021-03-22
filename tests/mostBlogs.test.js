const { mostBlogs } = require('../utils/list_helper')
const { listWithOneBlog, blogs } = require('./testData')


describe('most blogs', () => {
  test('of empty list', () => {
    expect(mostBlogs([])).toBe(null)
  })

  test('of one blog should be that blog', () => {
    expect(mostBlogs(listWithOneBlog))
      .toEqual({ author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('of many blogs should be correct', () => {
    expect(mostBlogs(blogs))
      .toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })
})