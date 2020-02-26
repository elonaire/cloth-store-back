module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    user_id: DataTypes.STRING,
    order_id: DataTypes.STRING
  }, {});
  Cart.associate = (models) => {
    // associations can be defined here
    Cart.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };
  return Cart;
};