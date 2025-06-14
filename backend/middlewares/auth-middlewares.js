const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Нет авторизации" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Нет токена" });
  }

  try {
    const decoded = jwt.verify(token, "secret_key");
    req.user = decoded; // здесь userId и login из токена
    next();
  } catch (e) {
    return res.status(401).json({ message: "Неверный токен" });
  }
};
