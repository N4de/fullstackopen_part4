// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => (1);

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  const likes = blogs.reduce((total, blog) => ({ likes: total.likes + blog.likes }));
  return likes.likes;
};

module.exports = {
  dummy,
  totalLikes,
};
