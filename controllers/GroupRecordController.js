const GroupRecord = require('../models/GroupRecord')

const getUserByToken = require('../helpers/getUserByToken')
const getToken = require('../helpers/getToken')

const { Op } = require("sequelize");

module.exports = class GroupRecordController {
  static async createRecord(req, res) {
    const { reason, note, forwarding } = req.body

    if (!reason || !note) {
      res.status(422).json({ message: "Envie todas as informações." })
      return
    }
    const token = getToken(req)
    const user = await getUserByToken(token)

    let { multidisciplinary } = req.body

    if(!multidisciplinary){
      multidisciplinary = false
    }

    const record = {
      reason,
      multidisciplinary,
      note,
      forwarding,
      UserId: user.id
    };
    
    
    try {
      const createdRecord = await GroupRecord.create(record);
      res.status(201).json({ message: "Registro criado com sucesso!", createdRecord })
    } catch (error) {
      res.status(500).json({ message: `${error}` })
    }
  }

  static async getAllRecords(req, res) {
    const token = getToken(req)
    const user = await getUserByToken(token)
    
    try {
      const records = await GroupRecord.findAll({
        where: { UserId: user.id }
      });

      
      res.status(200).json({ records })
    } catch (error) {
      console.log(error);
    }
  }

  static async getRecordById(req, res) {
    const id = req.params.id
    const token = getToken(req)
    const user = await getUserByToken(token)
    
    try {
      const record = await GroupRecord.findByPk(id)

      if(record.UserId != user.id){
        res.status(422).json({ message: `Você não tem autorização!` })
        return
      }
      
      res.status(200).json({ record })
    } catch (error) {
      console.log(error);
    }
  }

  static async getAllRecordsWithFilters(req, res) {
    const token = getToken(req)
    const user = await getUserByToken(token)
    const { filterNome } = req.body
    try {
      const records = await GroupRecord.findAll({
        where: { UserId: user.id, reason: { [Op.like]: `%${filterNome}%` } }
      });

      res.status(200).json({ records })
    } catch (error) {
      console.log(error);
    }
  }

  static async updateRecord(req, res) {
    const id = req.params.id
    const token = getToken(req)
    const user = await getUserByToken(token)

    const { reason, note, forwarding } = req.body
    let { multidisciplinary } = req.body

    if(!multidisciplinary){
      multidisciplinary = false
    }

    const newRecord = {
      reason,
      multidisciplinary,
      note,
      forwarding,
    };
    
    try {
      const record = await GroupRecord.findByPk(id)

      if(record.UserId != user.id){
        res.status(422).json({ message: `Você não tem autorização!` })
        return
      }
      await GroupRecord.update(newRecord, { where: { id: id } });
      res.status(200).json({ message: 'Acolhimento atualizado com sucesso!', record })
    } catch (error) {
      console.log(error);
    }
  }

}