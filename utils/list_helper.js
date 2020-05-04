const _ = require('lodash')

const favoriteBlog = blogs => {
  if (!blogs.length) return null

  const reducer = (acc, curVal) => {
    if ( curVal.likes > acc.likes )
      return curVal
    return acc
  }
  return blogs.reduce(reducer)
}

const mostBlogs = blogs => {
  if (!blogs.length) return null
  const mostblogs =  _.chain(blogs)
    .countBy('author')
    .toPairs()
    .value()
    .sort((a, b) => b[1] - a[1])
  return { author: mostblogs[0][0], blogs: mostblogs[0][1] }
}

const mostLikes = blogs => {
  if (!blogs.length) return null
  const mostlikes = _(blogs)
    .groupBy('author')
    .map((items, auth) => {
      return { author: auth, likes: totalLikes(items) }
    })
    .value()
    .sort((a,b) => b.likes - a.likes)
  return mostlikes[0]
}

const totalLikes = blogs => {
  const reducer = (acc, curVal) => acc + curVal.likes
  return blogs.reduce(reducer,0)
}

module.exports =  {
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes
}