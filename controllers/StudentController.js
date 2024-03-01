const Student = require('../models/Student')
const User = require('../models/User')
const sequelize = require('../db/connection')
const createToken = require('../helpers/createToken')
const getUserByToken = require('../helpers/getUserByToken')
const getToken = require('../helpers/getToken')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize");
const Record = require('../models/Record')

module.exports = class StudentController {
  static async createStudent(req, res) {
    const { name, gender, matriculation, course, academicStatus, birth, locality, code_area, phone, email, levelEducation, reasonForDemand, typeTreatment } = req.body
    let { isColleger, residentStudent } = req.body
    if (!name || !gender || !matriculation || !course || !academicStatus || !birth || !locality || !code_area || !phone || !email || !levelEducation || !reasonForDemand || !typeTreatment) {
      res.status(422).json({ message: "Envie todas as informações." })
      return
    }

    if (!isColleger) {
      isColleger = false
    }
    if (!residentStudent) {
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
        where: { UserId: user.id },
        order: [
          ['createdAt', 'DESC'],
        ]
      });

      res.status(200).json({ students })
    } catch (error) {
      console.log(error);
    }
  }

  static async getAllStudentsWithFilters(req, res) {
    const token = getToken(req)
    const user = await getUserByToken(token)
    let { filterNome , filterMasculino, filterFeminino, filterResidentStudent, filterIsColleger, filterLevelEducation} = req.body
    let filterGender = "";

    if (!filterNome) {
      filterNome = ""
    }

    if (!filterLevelEducation) {
      filterLevelEducation = ""
    }

    if(!(filterMasculino == true && filterFeminino == true) || (!filterMasculino && !filterFeminino)){
      if(filterMasculino)filterGender = "Masculino"
      if(filterFeminino)filterGender = "Feminino"
    }

    if(filterResidentStudent == true){
      filterResidentStudent = 1
    }else{
      filterResidentStudent = ""
    }

    if(filterIsColleger == true){
      filterIsColleger = 1
    }else{
      filterIsColleger = ""
    }

    try {
      const students = await Student.findAll({
        where: { 
          UserId: user.id, 
          name: { [Op.like]: `%${filterNome}%` },
          gender: { [Op.like]: `%${filterGender}%` },
          residentStudent: { [Op.like]: `%${filterResidentStudent}%` },
          isColleger: { [Op.like]: `%${filterIsColleger}%` },
          levelEducation: { [Op.like]: `%${filterLevelEducation}%` },
        },
        order: [
          ['createdAt', 'DESC'],
        ]
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
    let { isColleger, residentStudent } = req.body

    if (!name || !gender || !matriculation || !course || !academicStatus || !birth || !locality || !code_area || !phone || !email || !levelEducation || !reasonForDemand || !typeTreatment) {
      res.status(422).json({ message: "Envie todas as informações." })
      return
    }

    if (!isColleger) {
      isColleger = false
    }
    if (!residentStudent) {
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
      if (student.UserId != user.id) {
        res.status(422).json({ message: `Você não tem autorização!` })
        return
      }
      await Student.update(newStudent, { where: { id: id } });
      res.status(200).json({ message: 'Estudante atualizado com sucesso!', newStudent })
    } catch (error) {
      console.log(error);
    }
  }

  static async getStatistics(req, res) {
    const token = getToken(req)
    const user = await getUserByToken(token)

    try {
      const gender = await Student.findAll({
        attributes: ['gender', [sequelize.fn('COUNT', sequelize.col('gender')), 'count']],
        where: {UserId: user.id},
        group: ['gender'],
      });

      const course = await Student.findAll({
        attributes: [
          'course',
          [sequelize.fn('COUNT', sequelize.col('course')), 'count'],
        ],
        where: {UserId: user.id},
        group: ['course'],
      });

      const created = await Student.findAll({
        attributes: [
          [sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
          [sequelize.fn('COUNT', sequelize.col('createdAt')), 'count'],
        ],
        where: {UserId: user.id},
        group: [sequelize.fn('YEAR', sequelize.col('createdAt'))],
      });

      const residentStudent = await Student.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN residentStudent = true THEN 1 ELSE 0 END')), 'resident'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN residentStudent = false THEN 1 ELSE 0 END')), 'no_resident'],
        ],
        where: {UserId: user.id},
      });

      const reasonForDemand = await Student.findAll({
        attributes: [
          'reasonForDemand',
          [sequelize.fn('COUNT', sequelize.col('reasonForDemand')), 'count'],
        ],
        where: {UserId: user.id},
        group: ['reasonForDemand'],
      });

      const multidisciplinary = await Record.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN multidisciplinary = true THEN 1 ELSE 0 END')), 'multidisciplinary'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN multidisciplinary = false THEN 1 ELSE 0 END')), 'individual'],
        ],
      });

      const resultStatistics = {
        gender,
        course,
        created,
        residentStudent,
        reasonForDemand,
        multidisciplinary
      }

      function ordenarPorCount(arr) {
        return arr.sort((a, b) => b.count - a.count);
      }

      for (const key in resultStatistics) {
        if (resultStatistics.hasOwnProperty(key)) {
          const array = resultStatistics[key];

          if (array.every(item => item.hasOwnProperty('count'))) {
            resultStatistics[key] = ordenarPorCount(array);
          }
        }
      }

      res.status(200).json({ resultStatistics })
    } catch (error) {
      console.log(error);
    }
  }
}