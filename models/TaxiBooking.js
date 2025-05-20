// In the migration file for TaxiBookings
const { Model, DataTypes } = require('sequelize');

class TaxiBooking extends Model {
  static associate(models) {
    this.belongsTo(models.User, { as : 'traveler', foreignKey: 'travelerId' });
    this.belongsTo(models.Vehicle, {as: 'assignedVehicle', foreignKey: 'vehicleId' });
  }
}

// Export the TaxiBooking model
module.exports = (sequelize) => {
  TaxiBooking.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    travelerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: null,
      references: {
        model: 'vehicles',
        key: 'id',
      },
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dropLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pickupLat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    pickupLng: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    dropLat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    dropLng: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    
    
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    bookedSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    isShared : {
        type: DataTypes.BOOLEAN,
        defaultValue : false,
    },
    seatsToShare: {  
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    travelerIds: {
      type: DataTypes.JSON, 
      allowNull: true,
    },
    bookingDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM(
        'pending', 
        'driver_accepted',
        'driver_rejected',
        'driver_arrived',
        'ride_started',
        'ride_completed',
        'cancelled'
      ),
      defaultValue: 'pending',
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM(
        'pending',
        'paid',
        'failed',
        'refunded'
      ),
      defaultValue: 'pending',
      field: 'payment_status'
    },
    scheduledAt: {
      type: DataTypes.DATE,
      field: 'scheduled_at'
    },
    startedAt: {
      type: DataTypes.DATE,
      field: 'started_at'
    },
    completedAt: {
      type: DataTypes.DATE,
      field: 'completed_at'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
  }, {
    sequelize,
    modelName: 'TaxiBooking',
    tableName: 'taxiBookings',
    timestamps: true,
  });

  return TaxiBooking;
};
