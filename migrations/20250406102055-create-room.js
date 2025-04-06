'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID, // Change to UUID for consistency
      },
      hostel_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Hostels',
          key: 'id'
        },
        onDelete: 'CASCADE', // Optional
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Optional: ensure that room names are provided
      },
      type: {
        type: Sequelize.ENUM,
        values: [
          'mixed_dormitory',
          'shared_dormitory',
          'womens_dormitory',
          'mens_dormitory',
          'deluxe_dormitory',
          'private_room' // Consistent naming
        ],
        allowNull: false,
      },
      bed_type: {
        type: Sequelize.ENUM('Double', 'Bunk Bed', 'Single Bed'),
        allowNull: false,
      },
      bed_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      max_occupancy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price_per_person: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      images: {
        type: Sequelize.JSON,
      },
      facility_ids: {
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
    await queryInterface.dropTable('Rooms');
  }
};
