'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('informations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      info_type: {
        type: Sequelize.ENUM(
          'Police',
          'Hospital',
          'Ambulance',
          'Bus Station',
          'Train Station',
          'Visa Information',
          'Tourist Board',
          'Travel Agency',
          'Emergency Services',
          'Currency Exchange',
          'Local Attractions',
          'Restaurants',
          'Hotels',
          'Public Restrooms',
          'Parking Facilities',
          'Tour Guides',
          'Shopping Areas',
          'Cultural Sites',
          'Adventure Activities',
          'Transportation Services'
        ),
        allowNull: false,
      },
      cityId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'id',
        },
      },
      contact_1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_2: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('informations');
  }
};
