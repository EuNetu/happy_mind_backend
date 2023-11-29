const jwt = require("jsonwebtoken");

const User = require("../models/User");
const verifyToken = require("../helpers/checkToken");

// pegar o usuário pelo token
const getUserByToken = async (token) => {

  if (!token) return res.status(401).json({ error: "Acesso negado!" });

 
  const decoded = jwt.verify(token, "happymind");

  const user = await User.findByPk(decoded.id);
  // console.log(user);

  return user;
};

module.exports = getUserByToken;