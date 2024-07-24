const { DataTypes } = require('sequelize');
const Joi = require("joi")
ShipmentStateModel = (sequelize) => {
  const ShipmentState = sequelize.define('shipment_state', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    shipment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    states_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null

    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  });

  return ShipmentState;
};

function validateUpdateShipmentState(obj) {
  const schema = Joi.object({
    shipment_id: Joi.number().integer().min(0).required(),
    states_id: Joi.number().integer().min(0).required(),
  });
  return schema.validate(obj);
}

module.exports = {
  ShipmentStateModel,
  validateUpdateShipmentState
}