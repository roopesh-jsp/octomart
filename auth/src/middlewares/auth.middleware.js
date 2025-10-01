const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token)
    return res.status(400).json({ message: "no valid token unauthorized" });
  try {
    const decodedToken = jwt.decode(token, process.envJWT_SECRET);
    if (!decodedToken)
      return res.status(400).json({ message: "no valid token " });
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = authMiddleware;
