// migrations/create_vehicle_prices.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vehicle_types', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      vehicleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'vehicles',
          key: 'id',
        },
      },
      pricePer5Km: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      additionalCharge: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vehicle_prices');
  }
};
