const Record = require('../models/Record');
const Student = require('../models/Student');
const getUserByToken = require('../helpers/getUserByToken');
const getToken = require('../helpers/getToken');


// const crypto = require('crypto');

// const DADOS_CRIPTOGRAFAR = {
//   algoritmo : "aes256",
//   codificacao : "utf8",
//   segredo : "chaves",
//   tipo : "hex"
// };

// function criptografar(senha) {
//   const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
//   cipher.update(senha);
//   return cipher.final(DADOS_CRIPTOGRAFAR.tipo);
// };

// function descriptografar(senha) {
//   try {
//     const decipher = crypto.createDecipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
//     let decrypted = decipher.update(senha, DADOS_CRIPTOGRAFAR.tipo, DADOS_CRIPTOGRAFAR.codificacao);
//     decrypted += decipher.final(DADOS_CRIPTOGRAFAR.codificacao);
//     return decrypted;
//   } catch (error) {
//     console.error('Erro ao descriptografar:', error);
//     throw new Error('Falha na descriptografia');
//   }
// }





module.exports = class RecordController {
  static async createRecord(req, res) {
    const { note, forwarding } = req.body
    const idStudent = req.params.id
    if (!note) {
      res.status(422).json({ message: "Envie todas as informações." })
      return
    }

    let { multidisciplinary } = req.body

    if (!multidisciplinary) {
      multidisciplinary = false
    }

    const record = {
      multidisciplinary,
      note,
      forwarding,
      StudentId: idStudent
    };
    const token = getToken(req)
    const user = await getUserByToken(token)

    try {
      const student = await Student.findByPk(idStudent)
      if (student.UserId != user.id) {
        res.status(422).json({ message: `Você não tem autorização!` })
        return
      }
      const createdRecord = await Record.create(record);

      res.status(201).json({ message: "Registro criado com sucesso!", createdRecord })
    } catch (error) {
      res.status(500).json({ message: `${error}` })
    }
  }

  static async getAllRecords(req, res) {
    const idStudent = req.params.id
    const token = getToken(req)
    const user = await getUserByToken(token)

    try {
      const student = await Student.findByPk(idStudent)
      if (student.UserId != user.id) {
        res.status(422).json({ message: `Você não tem autorização!` })
        return
      }
      const records = await Record.findAll({
        where: { StudentId: idStudent },
        order: [
          ['createdAt', 'DESC'],
        ]
      });

      // for (let i = 0; i < records.length; i++) {
      //   records[i].note = descriptografar( records[i].note)
      // }

      res.status(200).json({ records, student });
    } catch (error) {
      console.error('Erro ao obter registros:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  static async getRecordById(req, res) {
    const id = req.params.id
    const token = getToken(req)
    const user = await getUserByToken(token)

    try {
      let record = await Record.findByPk(id)
      const student = await Student.findByPk(record.StudentId)
      if (student.UserId != user.id) {
        res.status(422).json({ message: `Você não tem autorização!` })
        return
      }
      // record = {
      //   ...record,
      //   note: descriptografar(record.note)
      // }
      res.status(200).json({ record })
    } catch (error) {
      console.log(error);
    }
  }

  static async updateRecord(req, res) {
    const id = req.params.id
    const token = getToken(req)
    const user = await getUserByToken(token)

    const { note, forwarding } = req.body
    let { multidisciplinary } = req.body

    if (!multidisciplinary) {
      multidisciplinary = false
    }

    const newRecord = {
      multidisciplinary,
      note,
      forwarding,
    };

    try {
      const record = await Record.findByPk(id)
      const student = await Student.findByPk(record.StudentId)
      if (student.UserId != user.id) {
        res.status(422).json({ message: `Você não tem autorização!` })
        return
      }
      await Record.update(newRecord, { where: { id: id } });
      res.status(200).json({ message: 'Acolhimento atualizado com sucesso!', record })
    } catch (error) {
      console.log(error);
    }
  }

}