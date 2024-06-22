const { DataTypes } = require('sequelize');

CargoContentModel = (sequelize) => {
  const CargoContent = sequelize.define('cargo_content', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cargo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return CargoContent;
};


module.exports ={
  CargoContentModel,
}