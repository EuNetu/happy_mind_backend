const createToken = require('../helpers/createToken')
const getUserByToken = require('../helpers/getUserByToken')
const getToken = require('../helpers/getToken')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = class ChildController {
  static async register(req, res) {
    const { name, latName, age } = req.body

    if (!name || !lastName || !age ) {
      res.status(422).json({ message: "Envie todas as informações." })
      return
    }
  }
}