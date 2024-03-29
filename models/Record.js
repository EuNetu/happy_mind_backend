const { DataTypes } = require("sequelize");

const Student = require("./Student")
const db = require("../db/connection");

const Record = db.define("Record", {
  forwarding: {
    type: DataTypes.STRING,
  },
  multidisciplinary: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    require: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false,
    require: true,
  },
});

Record.belongsTo(Student);
Student.hasMany(Record);

module.exports = Record;