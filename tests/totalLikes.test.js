const listHelper = require('../utils/list_helper')
const {listWithOneBlog, blogs} = require('./testData')

describe('total likes', () => {


  test('of one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of empty list should be 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('of sample blogs should be 36', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})