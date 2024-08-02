const { DataTypes } = require('sequelize');
const Joi = require("joi")

CenterModel = (sequelize) => {
  const Center = sequelize.define('center', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    manager: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(30),
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
    },
  });

  return Center;
};


function validateNewCenter(obj) {
  const schema = Joi.object({
    manager: Joi.number().integer().min(0).required(),
    city: Joi.string().trim().min(3).max(20).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).required(),
    location: Joi.string().trim().min(1).max(100).required(),
  });
  return schema.validate(obj);
}

function validateUpdateCenter(obj) {
  const schema = Joi.object({
    manager: Joi.number().integer().min(0).optional(),
    city: Joi.string().trim().min(3).max(20).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).optional(),
    location: Joi.string().trim().min(1).max(100).optional(),
  });
  return schema.validate(obj);
}


module.exports = {
  CenterModel,
  validateNewCenter,
  validateUpdateCenter
}