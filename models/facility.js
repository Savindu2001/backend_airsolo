'use strict';

const { Model, DataTypes } = require('sequelize');

class Facility extends Model {
  static associate(models) {
    // Define associations here if needed
  }
}

// Export the Facility model
module.exports = (sequelize) => {
  Facility.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
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
    modelName: 'Facility',
    tableName: 'facilities',
    timestamps: true,
  });

  return Facility;
};
