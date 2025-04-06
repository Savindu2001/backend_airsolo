const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Room extends Model {}

Room.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    hostel_id: {
        type: DataTypes.UUID,
        references: {
            model: 'Hostels',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM,
        values: [
            'mixed_dormitory',
            'shared_dormitory',
            'womens_dormitory',
            'mens_dormitory',
            'deluxe_dormitory',
            'private_room'
        ],
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
    },
    facility_ids: {
        type: DataTypes.JSON,
    },
}, {
    sequelize,
    modelName: 'Room',
    tableName: 'Rooms',
    timestamps: true,
});

module.exports = Room;
