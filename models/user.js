'use strict';

const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static associate(models) {
    // Define associations here if needed
  }
}

// Export the User model
module.exports = (sequelize) => {
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender:{
      type: DataTypes.ENUM('Male','Female'),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('traveler', 'hotelier', 'driver', 'admin', 'staff'),
      allowNull: false,
    },
    profile_photo: {
      type: DataTypes.STRING,
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
    nic: {
      type: DataTypes.STRING,
      allowNull: true, // Nullable, only for hoteliers
    },
    driving_license_id: {
      type: DataTypes.STRING,
      allowNull: true, // Nullable, only for drivers
    },
  }, {
    sequelize, // Ensure this is passed correctly
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });

  return User;
};
