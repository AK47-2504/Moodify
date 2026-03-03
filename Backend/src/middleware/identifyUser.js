const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const redis = require("../config/cache");

async function identifyUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "Unauthorized Access - Token not Provided",
    });
  }

  const isTokenBlackListed = await redis.get(token);
  if (isTokenBlackListed) {
    return res.status(401).josn({
      message: "Invalid Token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}

module.exports = identifyUser;
