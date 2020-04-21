module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    category_id: DataTypes.STRING,
    category: DataTypes.STRING
  }, {});
  Category.associate = (models) => {
    // associations can be defined here
  };
  return Category;
};