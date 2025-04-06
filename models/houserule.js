'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HouseRule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HouseRule.init({
    hostel_id: DataTypes.UUID,
    room_id: DataTypes.UUID,
    rule: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'HouseRule',
  });
  return HouseRule;
};