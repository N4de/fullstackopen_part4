/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);


beforeEach(async () => {
  await Blog.deleteMany({});
  for (const blog of helper.initialBlogs) {
    const blogObject = new Blog(blog);
    // eslint-disable-next-line no-await-in-loop
    await blogObject.save();
  }
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body.length).toBe(2);
});

test('all blogs have an id property', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
});

test('blog can be added with POST', async () => {
  const newBlog = {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  const titles = response.body.map((r) => r.title);


  expect(response.body.length).toBe(helper.initialBlogs.length + 1);
  expect(titles).toContain(
    'First class tests',
  );
});

test('posting blog without likes adds likes to object', async () => {
  const newBlog = {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    __v: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  expect(response.body[helper.initialBlogs.length].likes).toBeDefined();
});

test('posting blog without title or url return 400', async () => {
  const newBlog = {
    _id: '5a422b891b54a676234d17fa',
    author: 'Robert C. Martin',
    __v: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

test('deleting blog works', async () => {
  const blogToDelete = helper.initialBlogs[0];

  await api
    .delete(`api/blogs/${blogToDelete._id}`)
    .expect(204);

  const response = await api.get('/api/blogs');
  expect(response.body.length).toBe(helper.initialBlogs.length - 1);
});


afterAll(() => {
  mongoose.connection.close();
});
