'use strict';

const { Model, DataTypes } = require('sequelize');

class Vehicle extends Model {
  static associate(models) {
    // Define associations here if needed
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
    type: {
      type: DataTypes.ENUM('Tuk Tuk', 'Van', 'Car', 'SUV'),
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
