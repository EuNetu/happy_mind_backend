const { DataTypes } = require("sequelize");

const Student = require("./Student")
const db = require("../db/connection");

const ResponsibleRecord = db.define("ResponsibleRecord", {
  responsible: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
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

ResponsibleRecord.belongsTo(Student);
Student.hasMany(ResponsibleRecord);

module.exports = ResponsibleRecord;