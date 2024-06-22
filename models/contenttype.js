const { DataTypes } = require('sequelize');
const Joi = require("joi")
ContentTypeModel = (sequelize) => {
  const ContentType = sequelize.define('content_type', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return ContentType;
};

function validateNewContentType(obj) {
  const schema = Joi.object({
    type: Joi.string().trim().min(1).max(30).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).required(),
    description: Joi.string().trim().min(1).max(100).required(),
    price: Joi.number().integer().min(0).required()
  });
  return schema.validate(obj);
}


function validateUpdateContentType(obj) {
  const schema = Joi.object({
    type: Joi.string().trim().min(1).max(30).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).optional(),
    description: Joi.string().trim().min(1).max(100).optional(),
    price: Joi.number().integer().min(0).optional()
  });
  return schema.validate(obj);
}

module.exports = {
  ContentTypeModel,
  validateNewContentType,
  validateUpdateContentType
}
