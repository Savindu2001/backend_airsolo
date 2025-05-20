'use strict';
const { Model, DataTypes } = require('sequelize');

class HostelBooking extends Model {
  static associate(models) {
    HostelBooking.belongsTo(models.User, { foreignKey: 'userId' });
    HostelBooking.belongsTo(models.Hostel, { foreignKey: 'hostelId' });
    HostelBooking.belongsTo(models.Room, { foreignKey: 'roomId' });
  }
}

module.exports = (sequelize) => {
  HostelBooking.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    hostelId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'hostel_id',
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'room_id',
    },
    bedType: {
      type: DataTypes.STRING,
      field: 'bed_type',
    },
    checkInDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'check_in_date',
    },
    checkOutDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'check_out_date',
    },
    numGuests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'num_guests',
    },
    amount: {
      type: DataTypes.DOUBLE,
      field: 'amount',
    },
    specialRequests: {
      type: DataTypes.TEXT,
      field: 'special_requests',
    },
    status: {
      type: DataTypes.STRING,
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
    modelName: 'HostelBooking',
    tableName: 'hostel_bookings',
    timestamps: true,
  });

  return HostelBooking;
};
