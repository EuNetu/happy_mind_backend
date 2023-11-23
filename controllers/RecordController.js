const Record = require('../models/Record')

module.exports = class RecordController {
  static async createRecord(req, res) {
    const { ChildId, percentage, note } = req.body

    if (!percentage || !note ) {
      res.status(422).json({ message: "Envie todas as informações." })
      return
    }

    const record = {
      percentage,
      note,
      ChildId
    };
    try {
      const createdRecord = await Record.create(record);

      res.status(201).json({ message: "Registro criado com sucesso!", createdRecord })
    } catch (error) {
      res.status(500).json({ message: `${error}` })
    }
  }

  static async getAllRecords(req, res) {
    
    try {
      const records = await Record.findAll({
        where: { ChildId: req.body.id }
      });

      
      res.status(200).json({ records })
    } catch (error) {
      console.log(error);
    }
  }
}