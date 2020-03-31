module.exports = (sequelize, DataTypes) => {
  const UserOrder = sequelize.define('UserOrder', {
    user_id: DataTypes.STRING,
    order_id: DataTypes.STRING
  }, {});
  UserOrder.associate = (models) => {
    // associations can be defined here
    UserOrder.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });

    UserOrder.belongsTo(models.Order, {
      foreignKey: 'order_id',
      onDelete: 'CASCADE'
    });
  };
  return UserOrder;
};