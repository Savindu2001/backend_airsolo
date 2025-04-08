'use strict';

const { Model, DataTypes } = require('sequelize');

class Hostel extends Model {
  static associate(models) {
    this.belongsTo(models.City, { foreignKey: 'cityId' });
    this.belongsTo(models.User, { foreignKey: 'hotelier_id' });
  }
}

// Export the Hostel model
module.exports = (sequelize) => {
  Hostel.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    hotelier_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users', 
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
          model: 'cities', 
          key: 'id',
      },
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    gallery: {
      type: DataTypes.JSON,
      allowNull: true,
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
    modelName: 'Hostel',
    tableName: 'hostels',
    timestamps: true,
  });

  return Hostel;
};
