const { Sequelize, DataTypes } = require('sequelize'); // Add this line

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    nic: DataTypes.STRING,
    profile_photo: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('traveler', 'hotelier', 'driver', 'admin'), // Define role as ENUM
      defaultValue: 'traveler', // Set default role
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'), // Correctly reference Sequelize.fn
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'), // Correctly reference Sequelize.fn
    },
  });

  return User;
};
