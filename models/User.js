const { DataTypes } = require("sequelize");

const db = require("../db/connection");

const User = db.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  code_area: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
});

module.exports = User;