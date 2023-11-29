const { DataTypes } = require("sequelize");

const User = require('./User')
const db = require("../db/connection");

const Student = db.define("Student", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  matriculation: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  course: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  academicStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    require: true,
  },
  locality: {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  levelEducation: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  residentStudent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    require: true,
  },
  isColleger: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    require: true,
  },
  reasonForDemand: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  typeTreatment: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
});

Student.belongsTo(User);
User.hasMany(Student);

module.exports = Student;