module.exports = {
  MONGODB_URI:
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://zyan:zhaoyan123@ds018258.mlab.com:18258/zyan',
  SECRET: 'peanut'
};
