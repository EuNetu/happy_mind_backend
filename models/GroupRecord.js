const { DataTypes } = require("sequelize");

const User = require("./User")
const db = require("../db/connection");

const GroupRecord = db.define("GroupRecord", {
  reason: {
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

GroupRecord.belongsTo(User);
User.hasMany(GroupRecord);

module.exports = GroupRecord;