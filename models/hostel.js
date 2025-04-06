const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your database config

class Hostel extends Model {}

Hostel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    hotelier_id: {
        type: DataTypes.UUID,
        references: {
            model: 'Users', // Assuming we have a Users table
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    address: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    contact_number: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    website: {
        type: DataTypes.STRING,
    },
    rating: {
        type: DataTypes.DECIMAL,
    },
    main_image: {
        type: DataTypes.STRING,
    },
    gallery: {
        type: DataTypes.JSON,
    },
}, {
    sequelize,
    modelName: 'Hostel',
    tableName: 'Hostels',
    timestamps: true,
});

module.exports = Hostel;
