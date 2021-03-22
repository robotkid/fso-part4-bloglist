const fp = require('lodash/fp')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, b) => total + b.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce(
      (acc, current) =>
        acc.likes > current.likes ? acc : current
    )
}

const mostBlogs = (blogList) => {
  if (blogList.length === 0) { return null }

  const [ author, blogs ] = fp.compose(
    fp.maxBy(fp.last),
    fp.entries,
    fp.countBy('author')
  )(blogList)
  return { author, blogs }
}

const mostLikes = (blogList) => {
  if (blogList.length === 0) { return null }

  const [ author, blogs ] = fp.compose(
    fp.maxBy(fp.last),
    fp.entries,
    fp.countBy('author')
  )(blogList)
  return { author, blogs }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}