'use strict';

const { Model, DataTypes } = require('sequelize');

class Vehicle extends Model {
  static associate(models) {
    this.belongsTo(models.VehicleType, { foreignKey: 'vehicleTypeId',as: 'vehicleType' });
    this.belongsTo(models.User, { as: 'driver', foreignKey: 'driver_id' });
    this.hasOne(models.HostVerification, { foreignKey: 'userId', as: 'status' });
    Vehicle.hasMany(models.TaxiBooking, {
      foreignKey: 'vehicleId',
      as: 'bookings'
    });
     

  }
}


module.exports = (sequelize) => {
  Vehicle.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vehicle_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    driver_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      }
    },
    vehicleTypeId: {
      type: DataTypes.UUID,
      references: {
        model: 'vehicle_types',
        key: 'id',
      },
      allowNull: false,
    },
    numberOfSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_available'
    },
    currentLat: {
      type: DataTypes.DOUBLE,
      field: 'current_lat'
    },
    currentLng: {
      type: DataTypes.DOUBLE,
      field: 'current_lng'
    },
    fcmToken: {
      type: DataTypes.STRING,
      field: 'fcm_token'
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
    modelName: 'Vehicle',
    tableName: 'vehicles',
    timestamps: true,
  });

  return Vehicle;
};
