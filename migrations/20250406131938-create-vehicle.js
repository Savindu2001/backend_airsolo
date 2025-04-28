'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehicles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      vehicle_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, 
      },
      driver_id: {
            type: Sequelize.UUID,
            references: {
              model: 'users',
              key: 'id',
            },
            allowNull: false,
            onDelete: 'CASCADE', 
            onUpdate: 'CASCADE', 
          },
      vehicleTypeId: {
           type: Sequelize.UUID,
           references: {
             model: 'vehicle_types',
             key: 'id',
           },
           allowNull: false,
           onDelete: 'CASCADE', 
           onUpdate: 'CASCADE', 
         },
        numberOfSeats: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      model: {
            type: Sequelize.STRING,
            allowNull: false
          },
          year: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          color: {
            type: Sequelize.STRING,
            allowNull: false
          },
          isAvailable: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            field: 'is_available'
          },
          currentLat: {
            type: Sequelize.DOUBLE,
            field: 'current_lat'
          },
          currentLng: {
            type: Sequelize.DOUBLE,
            field: 'current_lng'
          },
          fcmToken: {
            type: Sequelize.STRING,
            field: 'fcm_token'
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
    await queryInterface.dropTable('vehicles');
  },
};
