const User = require('../models/User')
const createToken = require('../helpers/createToken')

const bcrypt = require('bcrypt')

module.exports = class UserController {
  static async register(req, res) {
    const { name, lastName, email, password, confirmpassword, code_area, phone } = req.body;

    if (!name || !lastName || !email || !password || !confirmpassword || !code_area || !phone) {
      res.status(422).json({ message: "Invie todas as informações." })
    }

    if (!email.includes('@')) {
      res.status(422).json({ message: "Formato do e-mail inválido." })
    }

    const checkIfUserExists = await User.findOne({ where: { email: email } });

    if (checkIfUserExists) {
      res.status(422).json({ message: "Já existe um usário cadastrado com este e-mail." })
    }

    if (password != confirmpassword) {
      res.status(422).json({ message: "A confirmação de senha é diferente da senha." })
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

      // req.session.userid = createdUser.id;
      // req.session.user = user.name;

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
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      res.status(422).json({ message: "Senha incorreta." })
    }

    res.status(200).json({ message: `Seja Bem-Vindo, ${user.name}!` })
  }
}