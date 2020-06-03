module.exports = (sequelize, DataTypes) => {
  const UserPointAward = sequelize.define('UserPointAward', {
    user_id: DataTypes.STRING,
    points: DataTypes.INTEGER
  }, {});
  UserPointAward.associate = (models) => {
    // associations can be defined here
    UserPointAward.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };
  return UserPointAward;
};