const { DataTypes } = require('sequelize');
const Joi = require("joi")

TruckTypeModel = (sequelize) => {
  const TruckType = sequelize.define('Truck_type', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  });

  return TruckType;
};

function validateNewTruckType(obj) {
  const schema = Joi.object({
    type: Joi.string().trim().min(5).max(50).required(),
  });
  return schema.validate(obj);
}

function validateUpdateTruckType(obj) {
  const schema = Joi.object({
    type: Joi.string().trim().min(3).max(50).optional(),
  });
  return schema.validate(obj);
}

module.exports = {
  TruckTypeModel,
  validateNewTruckType,
  validateUpdateTruckType
}