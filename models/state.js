const { DataTypes } = require('sequelize');
const Joi = require("joi")
StateModel = (sequelize) => {
  const State = sequelize.define('state', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    state: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  });

  return State;
};

function validateNewState(obj) {
  const schema = Joi.object({
    state: Joi.string().trim().min(3).max(30).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).required(),
  });
  return schema.validate(obj);
}

function validateUpdateState(obj) {
  const schema = Joi.object({
    state: Joi.string().trim().min(3).max(30).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).optional(),
  });
  return schema.validate(obj);
}

module.exports = {
  StateModel,
  validateNewState,
  validateUpdateState
}