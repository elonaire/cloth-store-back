module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    file_id: DataTypes.STRING,
    file_name: DataTypes.STRING
  }, {});
  File.associate = (models) => {
    // associations can be defined here
    File.belongsTo(models.Product, {
      through: 'ProductFile',
      foreignKey: 'file_id',
      onDelete: 'CASCADE'
    });

    File.belongsTo(models.User, {
      through: 'UserFile',
      foreignKey: 'file_id',
      onDelete: 'CASCADE'
    });
  };
  return File;
};