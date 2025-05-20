'use strict';

const { Model, DataTypes } = require('sequelize');

class HouseRule extends Model {
  static associate(models) {
    // Define associations here if needed
  }
}

// Export the House Rule model
module.exports = (sequelize) => {
  HouseRule.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    hostel_id: {
      type: DataTypes.UUID,
      references: {
        model: 'hostels', // Reference to the Hostels table
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    room_id: {
      type: DataTypes.UUID,
      references: {
        model: 'rooms', // Reference to the Rooms table
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    rule: {
      type: DataTypes.TEXT,
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
    modelName: 'HouseRule',
    tableName: 'house_rules',
    timestamps: true,
  });

  return HouseRule;
};
