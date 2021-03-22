const {favoriteBlog} = require('../utils/list_helper')
const {listWithOneBlog, blogs} = require('./testData')

describe('favorite blog', () => {
  test('of empty list', () => {
    expect(favoriteBlog([])).toBe(null)
  })

  test('of one blog should be that blog', () => {
    expect(favoriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0])
  })

  test('of many blogs should be correct', () => {
    expect(favoriteBlog(blogs)).toEqual(blogs[2])
  })
})