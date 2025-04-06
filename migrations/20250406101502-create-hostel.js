'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Hostels', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID, // Keep as UUID
      },
      hotelier_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users', // Assuming you have a Users table
          key: 'id'
        },
        onDelete: 'CASCADE', // Optional
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      address: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      contact_number: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true, // Optional: ensure unique email
      },
      website: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.DECIMAL,
      },
      main_image: {
        type: Sequelize.STRING,
      },
      gallery: {
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Default to current timestamp
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), // Default to current timestamp on update
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Hostels');
  }
};
