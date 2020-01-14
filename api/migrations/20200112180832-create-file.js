'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: false,
        type: Sequelize.INTEGER
      },
      file_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      product_id: {
        allowNull: true,
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Products',
          key: 'product_id',
          as: 'product_id'
        }
      },
      user_id: {
        allowNull: true,
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'user_id',
          as: 'user_id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Files');
  }
};