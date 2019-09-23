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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
};
