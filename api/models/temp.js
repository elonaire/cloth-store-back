module.exports = (sequelize, DataTypes) => {
  const Temp = sequelize.define('Temp', {
    otp: DataTypes.STRING
  }, {});
  Temp.associate = (models) => {
    // associations can be defined here
    Temp.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };
  return Temp;
};