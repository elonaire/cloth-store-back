module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    review_id: DataTypes.STRING,
    review: DataTypes.STRING,
    rating: DataTypes.INTEGER
  }, {});
  Review.associate = models => {
    // associations can be defined here
    Review.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });

    Review.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };
  return Review;
};