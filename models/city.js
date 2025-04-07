
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class City extends Model {
  static associate(models) {
    // Define associations here if needed
  }
}

// Export the City model
module.exports = (sequelize) => {
  City.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    things_to_do: {
      type: DataTypes.JSON, // You can also use STRING if you prefer to store it as plain text
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON, // Store URLs or paths to images
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6), // Longitude with decimal points
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6), // Latitude with decimal points
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
    sequelize,
    modelName: 'City',
    tableName: 'cities',
    timestamps: true,
  });

  return City;
};
