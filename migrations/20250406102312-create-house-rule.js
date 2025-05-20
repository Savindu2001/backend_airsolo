'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('house_rules', {
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
      room_id: {
        type: Sequelize.UUID,
        references: {
          model: 'rooms', // Reference to the Rooms table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      rule: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    await queryInterface.dropTable('house_rules');
  },
};
