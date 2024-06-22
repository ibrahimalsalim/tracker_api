const { DataTypes } = require('sequelize');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity");


UserModel = (sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.STRING(30),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(80),
      allowNull: false
    }
  });

  return User;
};


// Validate Register User
function validateRegisterUser(obj) {
  const schema = Joi.object({
    type: Joi.number().integer().required(),
    first_name: Joi.string().trim().min(3).max(100).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).required(),
    last_name: Joi.string().trim().min(3).max(100).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).required(),
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
      .required(),
    address: Joi.string(),  //not final
    email: Joi.string().trim().min(5).max(100).required().email(),
    username: Joi.string().trim().min(2).max(200).required(),
    password: passwordComplexity().required(),
  });
  return schema.validate(obj);
}

// Validate Login User
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}
function generateToken(user) {
  return jwt.sign({ id: user.id, type: user.type }, process.env.JWT_SECRET_KEY);
}
function validateUpdateUser(obj) {
  const schema = Joi.object({
    type: Joi.number().integer().required(),
    first_name: Joi.string().trim().min(3).max(100).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).required(),
    last_name: Joi.string().trim().min(3).max(100).pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/).required(),
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
      .required(),
    address: Joi.string(),  //not final
    email: Joi.string().trim().min(5).max(100).required().email(),
    username: Joi.string().trim().min(2).max(200).required(),
    password: passwordComplexity().required(),
  });
  return schema.validate(obj);
}
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
module.exports = {
  UserModel,
  validateRegisterUser,
  validateLoginUser,
  generateToken,
  validateUpdateUser,
  hashPassword
};
