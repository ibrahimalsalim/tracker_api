const { DataTypes } = require('sequelize');
const Joi = require("joi")

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

function validateNewCargo() {


}

function validateUpdateCargo() {


}

module.exports = {
  CargoModel,
  validateNewCargo,
  validateUpdateCargo
}