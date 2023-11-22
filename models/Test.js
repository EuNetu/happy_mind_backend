const { DataTypes } = require("sequelize");

const db = require("../db/connection");

const Test = db.define("Test", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  percentage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    require: true,
  },
});

Test.belongsTo(Child);
Child.hasMany(Test);

module.exports = Test;