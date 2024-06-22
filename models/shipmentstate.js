const { DataTypes } = require('sequelize');

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
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  return ShipmentState;
};


module.exports = {
  ShipmentStateModel
}