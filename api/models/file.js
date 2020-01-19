module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    file_id: DataTypes.STRING,
    file_name: DataTypes.STRING
  }, {});
  File.associate = (models) => {
    // associations can be defined here
    File.hasMany(models.ProductFile, {
      foreignKey: 'file_id',
      as: 'productFiles'
    });

    File.hasMany(models.UserFile, {
      foreignKey: 'file_id',
      as: 'userFiles'
    });
  };
  return File;
};