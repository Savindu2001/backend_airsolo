'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('taxi_prices', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      fromCityId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cities', // Reference the cities table
          key: 'id',
        },
        onDelete: 'CASCADE', // Optional: if a city is deleted, delete associated taxi prices
      },
      toCityId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cities', // Reference the cities table
          key: 'id',
        },
        onDelete: 'CASCADE', // Optional: if a city is deleted, delete associated taxi prices
      },
      vehicleTypeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'vehicles', // Reference the vehicles table
          key: 'id',
        },
        onDelete: 'CASCADE', // Optional: if a vehicle is deleted, delete associated taxi prices
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('taxi_prices');
  },
};
