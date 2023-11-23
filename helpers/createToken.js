const  jwt = require('jsonwebtoken')

const createToken = async (user, req, res) => {
  
  // cria o token
  const token = jwt.sign({
    name: user.name,
    id: user.id
  }, 'happymind')

  // retorna o token
  res.status(201).json({
    message: 'AUTENTICADO',
    token: token,
    userId: user.id
  })
}

module.exports = createToken