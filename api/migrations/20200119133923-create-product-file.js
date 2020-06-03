module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ProductFiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      file_id: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Files',
          key: 'file_id',
          as: 'file_id'
        },
      },
      product_id: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Products',
          key: 'product_id',
          as: 'product_id'
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('ProductFiles')
};