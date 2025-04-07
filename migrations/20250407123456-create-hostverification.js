'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('host_verifications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4 // Use Sequelize's built-in UUIDV4 function
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      nic_front: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nic_back: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      license_front: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      license_back: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Use NOW for created_at
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Use NOW for updated_at
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('host_verifications');
  }
};
