'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      hostel_id: {
        type: Sequelize.UUID,
        references: {
          model: 'hostels', // Reference to the Hostels table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
          'mixed_dormitory',
          'shared_dormitory',
          'womens_dormitory',
          'mens_dormitory',
          'deluxe_dormitory',
          'private_room'
        ),
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
        allowNull: true,
      },
      facility_ids: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updated_at',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rooms');
  },
};
