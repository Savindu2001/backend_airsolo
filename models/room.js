'use strict';

const { Model, DataTypes } = require('sequelize');

class Room extends Model {
  static associate(models) {
    // Define associations here if needed
  }
}

// Export the Room model
module.exports = (sequelize) => {
  Room.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    hostel_id: {
      type: DataTypes.UUID,
      references: {
        model: 'hostels', 
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        'mixed_dormitory',
        'shared_dormitory',
        'womens_dormitory',
        'mens_dormitory',
        'deluxe_dormitory',
        'private_room'
      ),
      allowNull: false,
    },
    bed_type: {
      type: DataTypes.ENUM('Double', 'Bunk Bed', 'Single Bed'),
      allowNull: false,
    },
    bed_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_occupancy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price_per_person: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    facility_ids: {
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
    modelName: 'Room',
    tableName: 'rooms',
    timestamps: true,
  });

  return Room;
};
