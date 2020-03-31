module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: DataTypes.STRING,
    quantity: DataTypes.NUMBER,
    status: DataTypes.STRING,
    delivery_details: DataTypes.JSON
  }, {});
  Order.associate = (models) => {
    // associations can be defined here
    Order.belongsTo(models.User, {
      through: 'UserOrder',
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });

    Order.belongsTo(models.Product, {
      through: 'ProductOrder',
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
  };
  return Order;
};