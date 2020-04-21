module.exports = (sequelize, DataTypes) => {
  const Subcategory = sequelize.define('Subcategory', {
    subcategory_id: DataTypes.STRING,
    subcategory: DataTypes.STRING
  }, {});
  Subcategory.associate = (models) => {
    // associations can be defined here
    Subcategory.belongsTo(models.Category, {
      foreignKey: 'category_id',
      onDelete: 'CASCADE'
    });
  };
  return Subcategory;
};