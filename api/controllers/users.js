const jwt = require("jsonwebtoken");
const generateUUID = require("hat");
const User = require("../models").User;
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const generateOTP = require("./otp");

// Add a user (for admin)
exports.addUser = (req, res, next) => {};

// Register a new public user
exports.registerUser = async (req, res, next) => {
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

    try {
      let users = await User.findAll({
        where: {
          [Op.or]: [
            { username: userDetails.username },
            { email: userDetails.email },
            { phone: userDetails.phone }
          ]
        }
      });

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
          bcrypt.hash(userDetails.password, salt, async (err, hash) => {
            // generate userID
            userDetails["userID"] = generateUUID();

            try {
              let user = await User.create({
                username: userDetails.username,
                user_id: userDetails.userID,
                user_role: 'PUBLIC',
                first_name: userDetails.firstName,
                last_name: userDetails.lastName,
                phone: userDetails.phone,
                email: userDetails.email,
                password: hash
              });

              res.status(201).json(user);
            } catch (error) {
              error => res.status(400).json(error);
            }
          });
        });
      }
    } catch (err) {
      err => res.status(400).json(err);
    }
  } else {
    res.status(400).json({
      message: "ensure the payload has all the required information"
    });
  }
};

// authenticate a user
exports.authenticateUser = async (req, res, next) => {
  let loginCredentials = req.body;
  try {
    let users = await User.findAll({
      where: {
        username: loginCredentials.username
      }
    });

    if (users.length > 0) {
      bcrypt.compare(
        loginCredentials.password,
        users[0].dataValues.password,
        (error, isMatched) => {
          console.log("isMatched", isMatched);

          if (isMatched) {
            // generate OTP
            let OTP = generateOTP();

            let accessToken = generateUUID.rack();
            let refreshToken = generateUUID.rack();

            // generate JWTAUTH
            let secret = process.env.SECRET;
            const JWTAUTH = jwt.sign(
              {
                username: loginCredentials.username
              },
              secret,
              {
                expiresIn: "1h"
              }
            );
            res.status(200).json({
              OTP,
              JWTAUTH
            });
          } else {
            error = "Wrong username or password";
            res.status(403).json({
              message: error
            });
          }
        }
      );
    } else {
      res.status(404).json({
        message: "User does not exist"
      });
    }
  } catch (err) {
    err => res.status(404).json(err);
  }
};
