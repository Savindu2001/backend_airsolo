const { Model, DataTypes } = require('sequelize');

class TaxiBooking extends Model {
  static associate(models) {
    // Define associations if needed
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.belongsTo(models.City, { foreignKey: 'fromCityId' });
    this.belongsTo(models.City, { foreignKey: 'toCityId' });
    this.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
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
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'vehicles',
        key: 'id',
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isShared: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sharedWith: {
      type: DataTypes.JSON, // Array of user IDs who are sharing the trip
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'TaxiBooking',
    tableName: 'taxi_bookings',
    timestamps: true,
  });

  return TaxiBooking;
};
