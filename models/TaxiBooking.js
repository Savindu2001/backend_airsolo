// In the migration file for TaxiBookings
const { Model, DataTypes } = require('sequelize');

class TaxiBooking extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'travelerId' });
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
      allowNull: false,
      references: {
        model: 'vehicles',
        key: 'id',
      },
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
      type: DataTypes.ENUM('pending', 'confirmed', 'canceled'),
      allowNull: false,
      defaultValue: 'pending',
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
