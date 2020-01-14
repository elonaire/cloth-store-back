module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id: DataTypes.STRING,
    category: DataTypes.STRING,
    type: DataTypes.STRING,
    gender: DataTypes.STRING,
    color: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER
  }, {});
  Product.associate = (models) => {
    // associations can be defined here
    Product.hasMany(models.File, {
      foreignKey: 'file_id',
      as: 'productFiles'
    });
  };
  return Product;
};