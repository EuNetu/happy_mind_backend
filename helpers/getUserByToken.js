const jwt = require("jsonwebtoken");

const User = require("../models/User");
const verifyToken = require("../helpers/checkToken");

// pegar o usuário pelo token
const getUserByToken = async (token) => {
  
  if (!token) return res.status(401).json({ error: "Acesso negado!" });

 
  const decoded = jwt.verify(token, "happymind");

  const userId = decoded.id;

  const user = await User.findOne({ id: userId });

  return user;
};

module.exports = getUserByToken;