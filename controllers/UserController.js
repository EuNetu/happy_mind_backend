const User = require('../models/User')
const createToken = require('../helpers/createToken')
const getUserByToken = require('../helpers/getUserByToken')
const getToken = require('../helpers/getToken')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = class UserController {
  static async register(req, res) {
    const { name, lastName, email, password, confirmpassword, code_area, phone } = req.body;

    if (!name || !lastName || !email || !password || !confirmpassword || !code_area || !phone) {
      res.status(422).json({ message: "Envie todas as informações." })
      return
    }


    if (!email.includes('@')) {
      res.status(422).json({ message: "Formato do e-mail inválido." })
      return
    }

    const checkIfUserExists = await User.findOne({ where: { email: email } });

    if (checkIfUserExists) {
      res.status(422).json({ message: "Já existe um usário cadastrado com este e-mail." })
      return
    }

    if (password != confirmpassword) {
      res.status(422).json({ message: "A confirmação de senha é diferente da senha." })
      return
    }


    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      lastName,
      email,
      code_area,
      phone,
      password: hashedPassword,
    };
    try {
      const createdUser = await User.create(user);

      await createToken(createdUser, req, res);
    } catch (error) {
      res.status(500).json({ message: `${error}` })
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(422).json({ message: "usuário não encontrado." })
      return
    }


    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      res.status(422).json({ message: "Senha incorreta." })
      return
    }


    await createToken(user, req, res)
  }

  static async checkUser(req, res) {
    let currentUser

    console.log(req.headers.authorization)

    if (req.headers.authorization) {
      const token = getToken(req)
      const decoded = jwt.verify(token, 'happymind')

      currentUser = await User.findByPk(decoded.id)

      if (currentUser?.password) currentUser.password = undefined
    } else {
      currentUser = null
    }

    res.status(200).send(currentUser)
  }

  static async getUserById(req, res) {
    const id = req.params.id

    const user = await User.findByPk(id)

    if (!user) {
      res.status(422).json({ message: 'Usuário não encontrado!' })
      return

    }

    res.status(200).json({ user })
  }

  static async updateUser(req, res) {
    const token = getToken(req)

    const user = await getUserByToken(token)

    if(user.id != req.params.id) {
      res.status(422).json({ message: 'O id da passado como parâmetro é diferente do token logado.' })
      return
    }

    const { name, lastName, email, confirmpassword, password, code_area, phone } = req.body;

    const passwordMatch = bcrypt.compareSync(confirmpassword, user.password);

    if (!passwordMatch) {
      res.status(422).json({ message: 'Senha incorreta! Não foi possível realizar as alterações.' })
      return
    }


    const userExists = await User.findOne({ email: email })

    if (user.email !== email && userExists) {
      res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
      return
    }


    const newProfile = {
      name,
      lastName,
      password,
      code_area,
      phone,
    };

    try {
      await User.update(newProfile, { where: { id: user.id } });
      res.status(200).json({
        message: 'Usuário atualizado com sucesso!',
      })
    } catch (error) {
      res.status(500).json({ message: error })
    }
  }
}