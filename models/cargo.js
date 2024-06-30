const { DataTypes } = require('sequelize');
const Joi = require("joi")

const { clientSchema } = require("./client")

CargoModel = (sequelize) => {
  const Cargo = sequelize.define('cargo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    shipment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  });

  return Cargo;
};


const contentSchema = Joi.object({
  content_type_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().required(),
  weight: Joi.number().integer().required()
});


function validateNewCargo(obj) {
  const schema = Joi.object({
    shipment_id: Joi.number().integer().min(0).required(),
    sender: clientSchema,
    receiver: clientSchema,
    contents: Joi.array().items(contentSchema).required(),
  });
  return schema.validate(obj);
}

function validateUpdateCargo(obj) {
  const schema = Joi.object({
    shipment_id: Joi.number().integer().min(0).optional(),
    sender_id: Joi.number().integer().min(0).optional(),
    receiver_id: Joi.number().integer().min(0).optional(),
    state: Joi.string().min(1).optional(20),
  });
  return schema.validate(obj);

}



module.exports = {
  CargoModel,
  validateNewCargo,
  validateUpdateCargo
}