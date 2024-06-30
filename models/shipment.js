const { DataTypes } = require('sequelize');
const Joi = require("joi")

ShipmentModel = (sequelize) => {
  const Shipment = sequelize.define('shipment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    truck_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shipment_priority_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    send_center: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receive_center: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Shipment;
};

function validateNewShipment(obj) {
  const schema = Joi.object({
    truck_id: Joi.number().integer().min(0).required(),
    shipment_priority_id: Joi.number().integer().min(0).required(),
    send_center: Joi.number().integer().min(0).required(),
    receive_center: Joi.number().integer().min(0).required(),
  });
  return schema.validate(obj);
}

function validateUpdateShipment(obj) {
  const schema = Joi.object({
    truck_id: Joi.number().integer().min(0).optional(),
    shipment_priority_id: Joi.number().integer().min(0).optional(),
    send_center: Joi.number().integer().min(0).optional(),
    receive_center: Joi.number().integer().min(0).optional(),
  });
  return schema.validate(obj);
}

module.exports = {
  ShipmentModel,
  validateNewShipment,
  validateUpdateShipment
}