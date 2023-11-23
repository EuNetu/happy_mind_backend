const { DataTypes } = require("sequelize");

const User = require('./User')
const db = require("../db/connection");

const Child = db.define("Child", {
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
  birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    require: true,
  },
});

Child.belongsTo(User);
User.hasMany(Child);

module.exports = Child;