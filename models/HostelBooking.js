// models/HostelBooking.js
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
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    hostelId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    roomId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'room_id'
      },
      bedType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'bed_type'
      },
    checkInDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    checkOutDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    guests: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'HostelBooking',
    tableName: 'hostel_bookings',
    timestamps: true
  });

  return HostelBooking;
};
