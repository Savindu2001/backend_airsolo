
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Information extends Model {
  static associate(models) {
    this.belongsTo(models.City,{ foreignKey: 'cityId' });
  }
}

// Export the Information model
module.exports = (sequelize) => {
  Information.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    info_type: {
        type: DataTypes.ENUM(
            'Police',
            'Hospital',
            'Ambulance',
            'Bus Station',
            'Train Station',
            'Visa Information',
            'Tourist Board',
            'Travel Agency',
            'Emergency Services',
            'Currency Exchange',
            'Local Attractions',
            'Restaurants',
            'Hotels',
            'Public Restrooms',
            'Parking Facilities',
            'Tour Guides',
            'Shopping Areas',
            'Cultural Sites',
            'Adventure Activities',
            'Transportation Services'
          ),
        allowNull: false,
      },
    cityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'cities', 
            key: 'id',
        },
      },
    contact_1: {
        type: DataTypes.STRING,
        null: false
    },
    contact_2: {
        type: DataTypes.STRING,
        null: true
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
    modelName: 'Information',
    tableName: 'informations',
    timestamps: true,
  });

  return Information;
};
