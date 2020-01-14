module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    file_id: DataTypes.STRING
  }, {});
  File.associate = (models) => {
    // associations can be defined here
    File.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });

    File.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };
  return File;
};