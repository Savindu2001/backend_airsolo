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
          type: {
            type: Sequelize.ENUM('Tuk Tuk', 'Car', 'Van', 'SUV'),
            allowNull: false,
          },
          priceFor5Km: {  
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          additionalPricePerKm: { 
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            field: 'created_at',
          },
          updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            field: 'updated_at',
          },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vehicle_types');
  }
};
