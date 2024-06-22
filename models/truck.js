const { DataTypes } = require('sequelize');
const Joi = require("joi")
TruckModel = (sequelize) => {
  const Truck = sequelize.define('truck', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    driver: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    latitude: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: null
    },
    longitude: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: null
    }
  });

  return Truck;
};

function validateNewTruck(obj) {
  const schema = Joi.object({
    driver: Joi.number().integer().min(0).required(),
    type: Joi.number().integer().min(0).required(),
    model: Joi.string().trim().min(5).max(50).required(),
  });
  return schema.validate(obj);
}

function validateUpdateTruck(obj) {
  const schema = Joi.object({
    driver: Joi.number().integer().min(0).optional(),
    type: Joi.number().integer().min(0).optional(),
    model: Joi.string().trim().min(5).max(50).optional(),
  });
  return schema.validate(obj);
}


module.exports = {
  TruckModel,
  validateNewTruck,
  validateUpdateTruck
  
}