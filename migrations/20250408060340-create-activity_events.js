'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('activity_events', {
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
      cityId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'id',
        },
      },
      available_days: {
        type: Sequelize.STRING, // Store as a comma-separated string
        allowNull: true,
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      activity_type: {
        type: Sequelize.ENUM(
          'DJ Party',
          'Hike',
          'BBQ Night',
          'Dancing',
          'Concert',
          'Workshop',
          'Theater',
          'Food Festival',
          'Cultural Event',
          'Sports Event',
          'Outdoor Movie Night',
          'Art Exhibition',
          'Live Music',
          'Wellness Retreat',
          'Market Tour',
          'Photography Walk'
        ),
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
    await queryInterface.dropTable('activity_events');
  }
};
