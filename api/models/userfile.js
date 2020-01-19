module.exports = (sequelize, DataTypes) => {
  const UserFile = sequelize.define('UserFile', {
    user_id: DataTypes.STRING,
    file_id: DataTypes.STRING
  }, {});
  UserFile.associate = (models) => {
    // associations can be defined here
    UserFile.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };
  return UserFile;
};