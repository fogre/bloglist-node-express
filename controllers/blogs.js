const jwt = require('express-jwt');
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1 })
  res.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog)
    res.json(blog.toJSON())
  else
    res.status(404).end()
})

blogsRouter.delete('/:id', jwt({ secret: process.env.SECRET }), async (req, res) => {
  const user = await User.findById(req.user.id)
  const blog = await Blog.findById(req.params.id)
  if (user.id.toString() !== blog.user.toString())
    return res.status(401).send({ error: 'unauthorized' })

  await Blog.findByIdAndRemove(req.params.id)
  user.blogs = user.blogs.filter(blogID => blogID.toString() !== req.params.id)
  await user.save()
  res.status(204).end()
})

blogsRouter.post('/', jwt({ secret: process.env.SECRET }), async (req, res) => {
  const user = await User.findById(req.user.id)
  const blog = new Blog({
    title: req.body.title,
    author: req.body.author || null,
    url: req.body.url,
    likes: req.body.likes || 0,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.json(savedBlog.toJSON())
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body
  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(req.params.id, blog, { new : true })
  res.json(updatedBlog.toJSON())
})

module.exports = blogsRouter