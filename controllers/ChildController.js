const Child = require('../models/Child')
const User = require('../models/User')
const createToken = require('../helpers/createToken')
const getUserByToken = require('../helpers/getUserByToken')
const getToken = require('../helpers/getToken')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = class ChildController {
  static async createChild(req, res) {
    const { name, lastName, birth } = req.body

    if (!name || !lastName || !birth ) {
      res.status(422).json({ message: "Envie todas as informações." })
      return
    }

    const token = getToken(req)
    const user = await getUserByToken(token)

    const child = {
      name,
      lastName,
      birth,
      UserId: user.id
    };
    try {
      const createdChild = await Child.create(child);

      res.status(201).json({ message: "Perfil da criança criado com sucesso!", createdChild })
    } catch (error) {
      res.status(500).json({ message: `${error}` })
    }
  }

  static async getAllChildren(req, res) {
    const token = getToken(req)
    const user = await getUserByToken(token)

    
    try {
      const children = await Child.findAll({
        where: { UserId: user.id }
      });

      
      res.status(200).json({ children })
    } catch (error) {
      console.log(error);
    }
  }
}