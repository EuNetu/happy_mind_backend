const { DataTypes } = require("sequelize");

const Child = require("./Child")
const db = require("../db/connection");

const Record = db.define("Record", {
  percentage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    require: true,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
});

Record.belongsTo(Child);
Child.hasMany(Record);

module.exports = Record;