const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const Record = db.define("Record", {
  percentage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    require: true,
  },
  date: {
    type: DataTypes.DATEONLY,
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