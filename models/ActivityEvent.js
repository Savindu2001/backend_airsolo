'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ActivityEvent extends Model {
  static associate(models) {
    this.belongsTo(models.City, { foreignKey: 'cityId' });
  }
}

// Export the ActivityEvent model
module.exports = (sequelize) => {
  ActivityEvent.init({
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
    cityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cities',
        key: 'id',
      },
    },
    available_days: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activity_type: {
      type: DataTypes.ENUM(
        'DJ Party',
        'Hike',
        'BBQ Night',
        'Dancing',
        'Concert',
        'Workshop',
        'Theater',
        'Food Festival',
        'Cultural Event',
        'Sports Event',
        'Outdoor Movie Night',
        'Art Exhibition',
        'Live Music',
        'Wellness Retreat',
        'Market Tour',
        'Photography Walk'
      ),
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
    sequelize,
    modelName: 'ActivityEvent',
    tableName: 'activity_events',
    timestamps: true,
  });

  return ActivityEvent;
};
