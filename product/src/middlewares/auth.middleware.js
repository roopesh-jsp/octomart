const jwt = require("jsonwebtoken");

async function createAuthMiddleware(roles = ["user"]) {
  return function authMiddleware(req, res, next) {
    const token =
      req.cookies?.token || req.headers?.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "unAutorized" });
    }
    try {
      const decode = jwt.decode(token, process.env.JWT_SECRET);
      if (!roles.includes(decode.role))
        return res.status(403).json({ message: "unAutorized no permission" });
      req.user = decode;
      next();
    } catch (error) {
      return res.status(500).json({ message: "failed to verify auth" });
    }
  };
}

module.exports = createAuthMiddleware;
