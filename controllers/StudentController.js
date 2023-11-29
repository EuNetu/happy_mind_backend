const Student = require('../models/Student')
const User = require('../models/User')
const createToken = require('../helpers/createToken')
const getUserByToken = require('../helpers/getUserByToken')
const getToken = require('../helpers/getToken')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize");

module.exports = class StudentController {
  static async createStudent(req, res) {
    const { name, gender, matriculation, course, academicStatus, birth, locality, code_area, phone, email, levelEducation, reasonForDemand, typeTreatment } = req.body
    let {isColleger,residentStudent} = req.body
    if (!name || !gender || !matriculation || !course || !academicStatus || !birth || !locality || !code_area || !phone || !email || !levelEducation  || !reasonForDemand || !typeTreatment ) {
      res.status(422).json({ message: "Envie todas as informações." })
      return
    }

    if(!isColleger){
      isColleger = false
    }
    if(!residentStudent){
      residentStudent = false
    }

    const token = getToken(req)
    const user = await getUserByToken(token)

    const student = {
      name,
      gender,
      matriculation,
      course,
      academicStatus,
      birth,
      locality,
      code_area,
      phone,
      email,
      levelEducation,
      residentStudent,
      isColleger,
      reasonForDemand,
      typeTreatment,
      UserId: user.id
    };
    console.log(student)
    try {
      const createdStudent = await Student.create(student);

      res.status(201).json({ message: "Estudante criado com sucesso!", createdStudent })
    } catch (error) {
      res.status(500).json({ message: `${error}` })
    }
  }

  static async getAllStudents(req, res) {
    const token = getToken(req)
    const user = await getUserByToken(token)

    console.log(user)
    try {
      const students = await Student.findAll({
        where: { UserId: user.id }
      });

      res.status(200).json({ students })
    } catch (error) {
      console.log(error);
    }
  }

  static async getAllStudentsWithFilters(req, res) {
    const token = getToken(req)
    const user = await getUserByToken(token)
    const { filterNome } = req.body
    
    try {
      const students = await Student.findAll({
        where: { UserId: user.id, name: { [Op.like]: `%${filterNome}%` } }
      });

      res.status(200).json({ students })
    } catch (error) {
      console.log(error);
    }
  }

  static async getStudentById(req, res) {
    const id = req.params.id

    const student = await Student.findByPk(id)

    if (!student) {
      res.status(422).json({ message: 'Usuário não encontrado!' })
      return

    }

    res.status(200).json({ student })
  }

  static async updateStudent(req, res) {
    const id = req.params.id
    const token = getToken(req)
    const user = await getUserByToken(token)

    const { name, gender, matriculation, course, academicStatus, birth, locality, code_area, phone, email, levelEducation, reasonForDemand, typeTreatment } = req.body
    let {isColleger,residentStudent} = req.body

    if (!name || !gender || !matriculation || !course || !academicStatus || !birth || !locality || !code_area || !phone || !email || !levelEducation  || !reasonForDemand || !typeTreatment ) {
      res.status(422).json({ message: "Envie todas as informações." })
      return
    }
    
    if(!isColleger){
      isColleger = false
    }
    if(!residentStudent){
      residentStudent = false
    }

    const newStudent = {
      name,
      gender,
      matriculation,
      course,
      academicStatus,
      birth,
      locality,
      code_area,
      phone,
      email,
      levelEducation,
      residentStudent,
      isColleger,
      reasonForDemand,
      typeTreatment,
    };
    
    try {
      const student = await Student.findByPk(id)
      if(student.UserId != user.id){
        res.status(422).json({ message: `Você não tem autorização!` })
        return
      }
      await Student.update(newStudent, { where: { id: id } });
      res.status(200).json({ message: 'Estudante atualizado com sucesso!', newStudent })
    } catch (error) {
      console.log(error);
    }
  }
}