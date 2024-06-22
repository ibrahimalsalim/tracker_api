const { DataTypes } = require('sequelize');
const Joi = require("joi")

UserTypeModel = (sequelize) => {
  const UserType = sequelize.define('user_type', {
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

  return UserType;
};

function validateNewUserType(obj) {
  const schema = Joi.object({
    type: Joi.string().trim().min(3).max(30).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).required(),
  });
  return schema.validate(obj);
}

function validateUpdateUserType(obj) {
  const schema = Joi.object({
    type: Joi.string().trim().min(3).max(30).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).optional(),
  });
  return schema.validate(obj);
}

module.exports = {
  UserTypeModel,
  validateNewUserType,
  validateUpdateUserType
}