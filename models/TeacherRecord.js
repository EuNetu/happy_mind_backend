const { DataTypes } = require("sequelize");

const User = require("./User")
const db = require("../db/connection");

const TeacherRecord = db.define("TeacherRecord", {
  teacher: {
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

TeacherRecord.belongsTo(User);
User.hasMany(TeacherRecord);

module.exports = TeacherRecord;