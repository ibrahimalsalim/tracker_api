const { DataTypes } = require('sequelize');
const Joi = require("joi")
ShipmentPriorityModel = (sequelize) => {
  const ShipmentPriority = sequelize.define('shipment_priority', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    priority: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    additional_wages: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return ShipmentPriority;
};

function validateNewShipmentPriority(obj) {
  const schema = Joi.object({
    priority: Joi.string().trim().min(1).max(100).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).required(),
    additional_wages: Joi.number().integer().min(0).max(100).required(),
  });
  return schema.validate(obj);
}


function validateUpdateShipmentPriority(obj) {
  const schema = Joi.object({
    priority: Joi.string().trim().min(1).max(100).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).optional(),
    additional_wages: Joi.number().integer().min(0).max(100).optional(),
  });
  return schema.validate(obj);
}

module.exports = {
  ShipmentPriorityModel,
  validateNewShipmentPriority,
  validateUpdateShipmentPriority
}