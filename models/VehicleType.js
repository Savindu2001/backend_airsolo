'use strict';

const { Model, DataTypes } = require('sequelize');

class VehicleType extends Model {
  static associate(models) {
    
  }
}

module.exports = (sequelize) => {
  VehicleType.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('Tuk Tuk', 'Car', 'Van', 'SUV'),
      allowNull: false,
    },
    priceFor5Km: {  
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    additionalPricePerKm: { 
      type: DataTypes.DECIMAL(10, 2),
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
    modelName: 'VehicleType',
    tableName: 'vehicle_types',
    timestamps: true,
  });

  return VehicleType;
};
