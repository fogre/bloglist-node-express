const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  res.json(users.map(user => user.toJSON()))
})

usersRouter.get('/:id', async (req, res) => {
  const user = await User
    .findById(req.params.id)
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  if (user)
    res.json(user.toJSON())
  else
    res.status(404).end()
})

usersRouter.post('/', async (req, res) => {
  if (!req.body.password || req.body.password.length <= 5)
    return res.status(400).json({ error: 'password too short or not provided' })
  const passwordHash = await bcrypt.hash(req.body.password, 10)
  const user = new User({
    username: req.body.username.toLowerCase(),
    name: req.body.name,
    passwordHash,
  })
  const savedUser = await user.save()
  res.json(savedUser)
})

module.exports = usersRouter