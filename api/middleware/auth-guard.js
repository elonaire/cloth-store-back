const jwt = require("jsonwebtoken");

let authGuard = (req, res, next) => {
  let token = req.get("Authorization");
  if (token) {
    jwt.verify(token, process.env.USER_SECRET, (err, decoded) => {
      err ? res.status(403).json(err) : next();
    });
  } else {
    res.status(403).json({
      message: "Forbidden. Log in first!"
    });
  }
};

let adminGuard = (req, res, next) => {
  let token = req.get("Authorization");
  if (token) {
    jwt.verify(token, process.env.ADMIN_SECRET, (err, decoded) => {
      err ? res.status(403).json(err) : next();
    });
  } else {
    res.status(403).json({
      message: "Forbidden!"
    });
  }
};

let ictGuard = (req, res, next) => {
  let token = req.get("Authorization");
  if (token) {
    jwt.verify(token, process.env.ICT_SECRET, (err, decoded) => {
      err ? res.status(403).json(err) : next();
    });
  } else {
    res.status(403).json({
      message: "Forbidden!"
    });
  }
};

module.exports = {
  authGuard,
  adminGuard,
  ictGuard
};
