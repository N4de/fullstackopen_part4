const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  const blogBody = request.body;
  if (!blogBody.likes) {
    blogBody.likes = 0;
  }

  const user = await User.findById(blogBody.userId);

  const blog = new Blog({
    title: blogBody.title,
    author: blogBody.author,
    url: blogBody.url,
    likes: blogBody.likes,
    user: user._id,
  });
  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put('/:id', (request, response, next) => {
  const { body } = request;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true, omitUndefined: true })
    .then((updatedBlog) => {
      response.status(200).json(updatedBlog.toJSON());
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
