module.exports = (sequelize, DataTypes) => {
  const ProductOrder = sequelize.define('ProductOrder', {
    order_id: DataTypes.STRING,
    product_id: DataTypes.STRING
  }, {});
  ProductOrder.associate = (models) => {
    // associations can be defined here
    ProductOrder.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });

    ProductOrder.belongsTo(models.Order, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
  };
  return ProductOrder;
};