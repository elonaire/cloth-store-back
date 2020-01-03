const jwt = require("json-web-token");
const generateUUID = require("hat");
const User = require("../models").User;
const bcrypt = require("bcryptjs");

// Add a user (for admin)
exports.addUser = (req, res, next) => {};

// Register a new public user
exports.registerUser = (req, res, next) => {
  let userDetails = req.body;
  if (
    userDetails.username &&
    userDetails.firstName &&
    userDetails.lastName &&
    userDetails.phone &&
    userDetails.email &&
    userDetails.password
  ) {
    // encrypt password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(userDetails.password, salt, (err, hash) => {
        // generate userID
        userDetails["userID"] = generateUUID();

        return User.create({
          username: userDetails.username,
          user_id: userDetails.userID,
          first_name: userDetails.firstName,
          last_name: userDetails.lastName,
          phone: userDetails.phone,
          email: userDetails.email,
          password: hash
        })
          .then(user => res.status(201).json(user))
          .catch(error => res.status(400).json(error));
      });
    });
  } else {
    res.status(400).json({
      message: "ensure the payload has all the required information"
    });
  }
  
};

// authenticate a user
exports.authenticateUser = (req, res, next) => {
  let loginCredentials = req.body;
};
