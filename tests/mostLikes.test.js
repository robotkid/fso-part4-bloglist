const { mostLikes } = require('../utils/list_helper')
const { listWithOneBlog, blogs } = require('./testData')


describe('most likes', () => {
  test('of empty list', () => {
    expect(mostLikes([])).toBe(null)
  })

  test('of one blog should be that blog', () => {
    expect(mostLikes(listWithOneBlog))
      .toEqual({ author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('of many blogs should be correct', () => {
    expect(mostLikes(blogs))
      .toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })
})