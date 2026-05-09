const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) return res.status(403).json("No token");

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(401).json("Invalid token");

    req.user = user;
    next();
  });
};