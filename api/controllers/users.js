const jwt = require("json-web-token");
const generateUUID = require("hat");
const User = require("../models").User;
const bcrypt = require("bcryptjs");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
    let userExists = false;

    User.findAll({
      where: {
        [Op.or]: [
          { username: userDetails.username },
          { email: userDetails.email },
          { phone: userDetails.phone }
        ]
      }
    })
    .then(users => {
      if (users.length > 0) {
        userExists = true;
      }

      if (userExists) {
        res.status(403).json({
          message: "user already exists"
        });
      } else {
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
      }
    })
    .catch(err => res.status(400).json(err));
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
