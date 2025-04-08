'use strict';

const { Model, DataTypes } = require('sequelize');

class TaxiPrice extends Model {
  static associate(models) {
    this.belongsTo(models.City, { foreignKey: 'fromCityId', as: 'fromCity' });
    this.belongsTo(models.City, { foreignKey: 'toCityId', as: 'toCity' });
    this.belongsTo(models.Vehicle, { foreignKey: 'vehicleTypeId' });
  }
}

// Export the TaxiPrice model
module.exports = (sequelize) => {
  TaxiPrice.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fromCityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cities',
        key: 'id',
      },
    },
    toCityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cities',
        key: 'id',
      },
    },
    vehicleTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'vehicles',
        key: 'id',
      },
    },
    price: {
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
    modelName: 'TaxiPrice',
    tableName: 'taxi_prices',
    timestamps: true,
  });

  return TaxiPrice;
};
