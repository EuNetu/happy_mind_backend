const { DataTypes } = require("sequelize");

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
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    require: true,
  },
});

Child.belongsTo(User);
User.hasMany(Child);

module.exports = Child;