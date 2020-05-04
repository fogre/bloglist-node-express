const testBlogs = require('./testData')
const listHelper = require('../utils/list_helper')

describe('Test data', () => {

  test('exists and contains blogs', () => {
    expect(testBlogs.length).toBeGreaterThan(0)
  })

  test('has likes', () => {
    expect(testBlogs[0].likes).toBeDefined()
  })
})

//Test variables
const semiRandomIndex = Math.floor(Math.random() * testBlogs.length-1) + 1
const oneList = []
oneList.push(testBlogs[semiRandomIndex])

let likes = 0
let indexOfHighestLikes = 0
testBlogs.forEach((blog, index) => {
  likes = likes + blog.likes
  if ( blog.likes > testBlogs[indexOfHighestLikes].likes )
    indexOfHighestLikes = index
})

//Testing of functions that really don't need unit testing, but it's an assignment so...
describe('Total likes', () => {

  test('of empty list is 0', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('of list that has only 1 blog the likes equals to that', () => {
    expect(listHelper.totalLikes(oneList))
      .toBe(testBlogs[semiRandomIndex].likes)
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(testBlogs)).toBe(likes)
  })
})

describe('Favorite blog', () => {

  test('of empty array returns an empty object', () => {
    expect(listHelper.favoriteBlog([])).toEqual(null)
  })

  test('of list that has only 1 blog returns that blog', () => {
    expect(listHelper.favoriteBlog(oneList)).toEqual(oneList[0])
  })

  test('returns the blog with highest likes', () => {
    expect(listHelper.favoriteBlog(testBlogs))
      .toEqual(testBlogs[indexOfHighestLikes])
  })
})

describe('Most blogs', () => {

  test('of empty array returns an empty object', () => {
    expect(listHelper.mostBlogs([])).toEqual(null)
  })

  test('returns the author with most entries', () => {
    expect(listHelper.mostBlogs(testBlogs))
      .toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('Most likes', () => {

  test('of empty array returns null', () => {
    expect(listHelper.mostLikes([])).toEqual(null)
  })

  test('returns the author with most entries', () => {
    expect(listHelper.mostLikes(testBlogs))
      .toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })
})