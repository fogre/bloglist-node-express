const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const testBlogs =require('./testData')

const initialBlogs = []
initialBlogs.push(testBlogs[0], testBlogs[1], testBlogs[3])

const initialUsers = [
  {
	  username: 'user',
	  name: 'initial user',
	  password: 'wordpass',
	  id: '5ea16edb473edc221b7aff5d',
	  _id: '5ea16edb473edc221b7aff5d'
  },
  {
  	username: 'root2',
	  name: 'initial user2',
	  password: 'salasana1',
	  id: '5ea16edb473edc231b7aff5d'
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'none' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const generateUser = async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
  return user;
}

const generateAuthHeader = (user) => {
	const userForToken = {
    username: user.username,
    id: user._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)
  return { Authorization: `bearer ${token.toString()}` }
}

module.exports = {
	blogsInDb,
	generateAuthHeader,
	generateUser,
	usersInDb,
  initialBlogs,
  initialUsers,
  nonExistingId,

}