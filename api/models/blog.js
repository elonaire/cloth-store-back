module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    post_id: DataTypes.STRING,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    post: DataTypes.STRING
  }, {});
  Blog.associate = (models) => {
    // associations can be defined here
  };
  return Blog;
};