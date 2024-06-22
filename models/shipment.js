const { DataTypes } = require('sequelize');

ShipmentModel = (sequelize) => {
  const Shipment = sequelize.define('shipment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    truck_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shipment_priority: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    send_center: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    recieve_center: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Shipment;
};


module.exports = {
  ShipmentModel
}