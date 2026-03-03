const jwt = require("jsonwebtoken");
module.exports = function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "change_me");
    req.user = payload;
  } catch {
    
  }
  next();
};