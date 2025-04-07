'use strict';

const { Model, DataTypes } = require('sequelize');

class HostVerification extends Model {
  static associate(models) {
    // Define associations here (e.g., HostVerification.belongsTo(models.User))
    HostVerification.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

module.exports = (sequelize) => {
  HostVerification.init({
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
    nic_front: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nic_back: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    license_front: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    license_back: {
        type: DataTypes.STRING,
        allowNull: true,
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
    modelName: 'HostVerification',
    tableName: 'host_verifications',
    timestamps: true,
  });

  return HostVerification;
};
