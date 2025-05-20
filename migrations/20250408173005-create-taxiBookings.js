'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('taxiBookings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      travelerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // Ensure the users table exists
          key: 'id',
        },
      },
      vehicleId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'vehicles', // Ensure the vehicles table exists
          key: 'id',
        },
      },
      pickupLocation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dropLocation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pickupLat: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      pickupLng: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      dropLat: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      dropLng: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      distance: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      bookedSeats: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      isShared: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      seatsToShare: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      travelerIds: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      bookingDateTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      status: {
        type: Sequelize.ENUM(
          'pending', 
        'driver_accepted',
        'driver_rejected',
        'driver_arrived',
        'ride_started',
        'ride_completed',
        'cancelled'
        ),
        allowNull: false,
        defaultValue: 'pending',
      },
      paymentStatus: {
            type: Sequelize.ENUM(
              'pending',
              'paid',
              'failed',
              'refunded'
            ),
            defaultValue: 'pending',
            field: 'payment_status'
          },
          scheduledAt: {
                type: Sequelize.DATE,
                field: 'scheduled_at'
              },
              startedAt: {
                type: Sequelize.DATE,
                field: 'started_at'
              },
              completedAt: {
                type: Sequelize.DATE,
                field: 'completed_at'
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
    await queryInterface.dropTable('taxiBookings');
  },
};
