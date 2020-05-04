const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('When getting blogs', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there is the right amount of blogs returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog can be viewed and it contains properties id and user', async () => {
    const blogsinDB = await helper.blogsInDb()
    const resultBlog = await api
  	  .get(`/api/blogs/${blogsinDB[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(resultBlog.body.id).toBeDefined()
    expect(resultBlog.body.user).toBeDefined()
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  afterAll(async () => {
    await Blog.deleteMany({})
  })
})  

describe('When posting, putting or deleting blogs', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
  })

  test('a valid blog can be added, its properties right are and blog is added to user', async () => {
    let user = await helper.generateUser()
    const newBlog = {
      title: 'Who is this Nodechan?',
      url: 'helsinki.fi',
      user: user._id
    }
    const blogsInStart = await helper.blogsInDb()
    await api
  	  .post('/api/blogs')
      .set(helper.generateAuthHeader(user))
  	  .send(newBlog)
  	  .expect(200)
  	  .expect('Content-Type', /application\/json/)

    const res = await api.get('/api/blogs')
    const users = await helper.usersInDb()
    const addedBlog = res.body.find(b => b.title === newBlog.title)
    expect(res.body).toHaveLength(blogsInStart.length + 1)
    expect(addedBlog.title).toEqual('Who is this Nodechan?')
    expect(addedBlog.likes).toBe(0)
    expect(addedBlog.user.id).toEqual(user._id.toString())
    expect(users[0].blogs).toHaveLength(1)
  })

  test('posting invalid blog fails with status code 400', async () => {
    const user = await helper.generateUser()
    const invalidBlog = {
      author: 'Michaela',
      likes: 0,
      user: user._id
    }
    await api
  	  .post('/api/blogs')
      .set(helper.generateAuthHeader(user))
      .send(invalidBlog)
      .expect(400)
  })

  test('a blog cannot be deleted by invalid user', async () => {
    const user = await helper.generateUser()
    await Blog.insertMany(helper.initialBlogs)
    const blogsinDB = await helper.blogsInDb()
    await api
  	  .delete(`/api/blogs/${blogsinDB[0].id}`)
      .set(helper.generateAuthHeader(user))
      .expect(401)
  })

  test('a blog can be deleted by valid user', async () => {
    let user =  await helper.generateUser();
    const newBlog = {
      title: 'Who is this Nodechan?',
      url: 'helsinki.fi',
      user: user._id
    } 
    await api
      .post('/api/blogs')
      .set(helper.generateAuthHeader(user))
      .send(newBlog)
      .expect(200)

    user = await User.findById(user._id)
    const blogsInDB = await helper.blogsInDb()
    expect(blogsInDB).toHaveLength(1)
    expect(user.blogs).toHaveLength(1)

    await api
      .delete(`/api/blogs/${blogsInDB[0].id}`)
      .set(helper.generateAuthHeader(user))
      .expect(204)
    user = await User.findById(user._id)  
    expect(await helper.blogsInDb()).toHaveLength(0)
    expect(user.blogs).toHaveLength(0)
  })

  test('put method updatets blog likes by 1', async () => {
    await Blog.insertMany(helper.initialBlogs)
    const blogsinDB = await helper.blogsInDb()
    const resultBlog = await api
      .put(`/api/blogs/${blogsinDB[0].id}`)
      .send({ likes: blogsinDB[0].likes + 1 })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(resultBlog.body.likes).toBe(blogsinDB[0].likes + 1)
  })
})  

afterAll(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  mongoose.connection.close()
})