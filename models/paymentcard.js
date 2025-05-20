'use strict';

const { Model, DataTypes } = require('sequelize');

class PaymentCard extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

// Export the PaymentCard model
module.exports = (sequelize) => {
  PaymentCard.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users', 
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cvv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    card_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exp_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'createdAt',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updatedAt',
    },
  }, {
    sequelize, 
    modelName: 'PaymentCard',
    tableName: 'paymentCards',
    timestamps: true,
  });

  return PaymentCard;
};
