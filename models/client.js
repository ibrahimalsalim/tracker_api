const { DataTypes } = require('sequelize');
const Joi = require("joi")

ClientModel = (sequelize) => {
  const Client = sequelize.define('client', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    national_id: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false
    }
  });

  return Client;
};
function validateNewClient(obj) {
  const schema = Joi.object({
    national_id: Joi.string().min(11).max(11).required(),
    first_name: Joi.string().trim().min(3).max(30).pattern(/^[\u0600-\u06FFa-zA-Z\s-]+$/).required(),
    last_name: Joi.string().trim().min(3).max(30).pattern(/^[\u0600-\u06FFa-zA-Z\s-]+$/).required(),
    date_of_birth: Joi.date()
      .less('now')
      .greater('1920-06-01')
      .custom((value, helpers) => {
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          return helpers.message('age must be at least 18 years old');
        }
        return value;
      })
      .required(),

    address: Joi.string().trim().min(5).max(100).required(),
    phone_number: Joi.string().trim().min(10).required(),
  });
  return schema.validate(obj);
}
function validateUpdateClient(obj) {
  const schema = Joi.object({
    national_id: Joi.string().min(11).max(11).optional(),
    first_name: Joi.string().trim().min(3).max(30).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).optional(),
    last_name: Joi.string().trim().min(3).max(30).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).optional(),
    date_of_birth: Joi.date()
      .less('now')
      .greater('1920-06-01')
      .custom((value, helpers) => {
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          return helpers.message('age must be at least 18 years old');
        }
        return value;
      })
      .optional(),

    address: Joi.string().trim().min(5).max(100).optional(),
    phone_number: Joi.string().trim().min(10).optional(),
  });
  return schema.validate(obj);
}

module.exports = {
  ClientModel,
  validateNewClient,
  validateUpdateClient
}
