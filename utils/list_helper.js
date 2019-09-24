const _ = require('lodash');


// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => (1);

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  const likes = blogs.reduce((total, blog) => ({ likes: total.likes + blog.likes }));
  return likes.likes;
};

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const favourite = blogs.reduce((current, accumulator) => {
    if (current.likes > accumulator.likes) {
      return current;
    }
    return accumulator;
  });

  return favourite;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const countedBlogs = _.countBy(blogs, 'author');

  let bestAuthor = {
    blogs: 0,
  };

  _.forIn(countedBlogs, (value, key) => {
    if (value > bestAuthor.blogs) {
      bestAuthor = {
        author: key,
        blogs: value,
      };
    }
  });


  return bestAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
};
