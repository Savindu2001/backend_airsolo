'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('paymentcards', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        
      },
      user_id: {
            type: Sequelize.UUID,
            references: {
              model: 'users', 
              key: 'id',
            },
            onDelete: 'CASCADE',
          },
      cardNumber: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cvv: {
        allowNull: false,
        type: Sequelize.STRING
      },
      card_type: {
            type: Sequelize.STRING,
            allowNull: false,
          },
      nickname: {
        allowNull: true,
        type: Sequelize.STRING
      },
      exp_date: {
        allowNull: false,
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('paymentcards');
  }
};