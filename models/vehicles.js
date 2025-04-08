'use strict';

const { Model, DataTypes } = require('sequelize');

class Vehicle extends Model {
  static associate(models) {
    this.belongsTo(models.VehicleType, { foreignKey: 'vehicleTypeId' });
    this.belongsTo(models.User, {foreignKey: 'driver_id'} );
  }
}

// Export the Vehicle model
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
      unique: true, // Ensure vehicle number is unique
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
    number_of_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    sequelize, // Ensure this is passed correctly
    modelName: 'Vehicle',
    tableName: 'vehicles',
    timestamps: true,
  });

  return Vehicle;
};
