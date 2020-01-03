const jwt = require("json-web-token");
const generateUUID = require("hat");
const User = require("../models").User;

// Add a user (for admin)
exports.addUser = (req, res, next) => {};

// Register a new public user
exports.registerUser = (req, res, next) => {
  let userDetails = req.body;
  if (
    userDetails.firstName &&
    userDetails.lastName &&
    userDetails.phone &&
    userDetails.email &&
    userDetails.password
  ) {
    userDetails["userID"] = generateUUID();
    return User.create({
      user_id: userDetails.userID,
      first_name: userDetails.firstName,
      last_name: userDetails.lastName,
      phone: userDetails.phone,
      email: userDetails.email,
      password: userDetails.password
    })
    .then(user => res.status(201).json(user))
    .catch(error => res.status(400).json(error));
  }
  res.status(400).json({
    message: "ensure payload has all the required information"
  });
};

// authenticate a user
exports.authenticateUser = (req, res, next) => {};
