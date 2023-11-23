const jwt = require("jsonwebtoken");

// middleware para validar o token
const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(token);
  console.log(authHeader);
  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    const verified = jwt.verify(token, "happymind");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "O Token é inválido!" });
  }
};

module.exports = checkToken;