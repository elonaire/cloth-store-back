module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    quantity: DataTypes.STRING,
    user_id: DataTypes.STRING,
    product_id: DataTypes.STRING
  }, {});
  Cart.associate = (models) => {
    // associations can be defined here
    Cart.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });

    Cart.hasMany(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
  };
  return Cart;
};