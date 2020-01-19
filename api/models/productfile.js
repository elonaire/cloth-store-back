module.exports = (sequelize, DataTypes) => {
  const ProductFile = sequelize.define('ProductFile', {
    product_id: DataTypes.STRING,
    file_id: DataTypes.STRING
  }, {});
  ProductFile.associate = (models) => {
    // associations can be defined here
    ProductFile.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
  };
  return ProductFile;
};