const ResponsibleRecord = require('../models/ResponsibleRecord')
const Student = require('../models/Student')

const getUserByToken = require('../helpers/getUserByToken')
const getToken = require('../helpers/getToken')

module.exports = class ResponsibleRecordController {
  static async createRecord(req, res) {
    const { responsible, note, forwarding } = req.body
    const idStudent = req.params.id
    if (!responsible || !note) {
      res.status(422).json({ message: "Envie todas as informações." })
      return
    }

    let { multidisciplinary } = req.body

    if(!multidisciplinary){
      multidisciplinary = false
    }

    const record = {
      responsible,
      multidisciplinary,
      note,
      forwarding,
      StudentId : idStudent
    };
    const token = getToken(req)
    const user = await getUserByToken(token)
    
    try {
      const student = await Student.findByPk(idStudent)
      if(student.UserId != user.id){
        res.status(422).json({ message: `Você não tem autorização!` })
        return
      }
      const createdRecord = await ResponsibleRecord.create(record);

      res.status(201).json({ message: "Registro criado com sucesso!", createdRecord })
    } catch (error) {
      res.status(500).json({ message: `${error}` })
    }
  }

  static async getAllRecords(req, res) {
    
    try {
      const records = await ResponsibleRecord.findAll({
        where: { StudentId: req.body.id }
      });

      
      res.status(200).json({ records })
    } catch (error) {
      console.log(error);
    }
  }

  static async getAllRecords(req, res) {
    const idStudent = req.params.id
    const token = getToken(req)
    const user = await getUserByToken(token)
    
    try {
      const student = await Student.findByPk(idStudent)
      if(student.UserId != user.id){
        res.status(422).json({ message: `Você não tem autorização!` })
        return
      }
      const records = await ResponsibleRecord.findAll({
        where: { StudentId: idStudent }
      });
      console.log(records)
      console.log(student)
      
      res.status(200).json({ records, student })
    } catch (error) {
      console.log(error);
    }
  }

  static async getRecordById(req, res) {
    const id = req.params.id
    const token = getToken(req)
    const user = await getUserByToken(token)
    
    try {
      const record = await ResponsibleRecord.findByPk(id)
      const student = await Student.findByPk(record.StudentId)
      if(student.UserId != user.id){
        res.status(422).json({ message: `Você não tem autorização!` })
        return
      }
      
      res.status(200).json({ record })
    } catch (error) {
      console.log(error);
    }
  }

  static async updateRecord(req, res) {
    const id = req.params.id
    const token = getToken(req)
    const user = await getUserByToken(token)

    const { responsible, note, forwarding } = req.body
    let { multidisciplinary } = req.body

    if(!multidisciplinary){
      multidisciplinary = false
    }

    const newRecord = {
      responsible,
      multidisciplinary,
      note,
      forwarding,
    };
    
    try {
      const record = await ResponsibleRecord.findByPk(id)
      const student = await Student.findByPk(record.StudentId)
      if(student.UserId != user.id){
        res.status(422).json({ message: `Você não tem autorização!` })
        return
      }
      await ResponsibleRecord.update(newRecord, { where: { id: id } });
      res.status(200).json({ message: 'Acolhimento atualizado com sucesso!', record })
    } catch (error) {
      console.log(error);
    }
  }

}