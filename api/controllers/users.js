const jwt = require("jsonwebtoken");
const generateUUID = require("hat");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { generateOTP } = require("./utils");
// const moment = require('moment');
const EventEmitter = require("events");
class Job extends EventEmitter { };
let createUser = new Job();

const { User } = require("../models");
const { Temp } = require("../models");
const { UserPointAward } = require("../models");

// Register a new public user
let registerUser = async (req, res, next) => {
  let userDetails = req.body;

  if (
    userDetails.username &&
    userDetails.first_name &&
    userDetails.last_name &&
    userDetails.gender &&
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

      console.log("passes db check");

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
            userDetails["user_id"] = generateUUID();

            try {
              let userRole = userDetails.user_role
                ? userDetails.user_role
                : "PUBLIC";
              console.log(userRole);

              let user = {};
              let userRoleIsDefined = false;

              for (let field of Object.keys(userDetails)) {
                if (field === "user_role") {
                  userRoleIsDefined = true;
                }
                if (field === "password") {
                  user[field] = hash;
                } else {
                  user[field] = userDetails[field];
                }
              }

              if (!userRoleIsDefined) {
                user["user_role"] = userRole;
              }

              console.log("built", user);

              let createdUser = await User.create(user);

              const points = await UserPointAward.create({
                user_id: user["user_id"]
              });

              res.status(201).json(createdUser);
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

// Add a user (for admin)
let addUser = registerUser;

// authenticate a user
let authenticateUser = async (req, res, next) => {
  let loginCredentials = req.body;
  try {
    let users = await User.findAll({
      where: {
        username: loginCredentials.username
      }
    });

    if (users.length > 0) {
      let userData = users[0].dataValues;
      bcrypt.compare(
        loginCredentials.password,
        userData.password,
        async (error, isMatched) => {
          // console.log("isMatched", isMatched);

          if (isMatched) {
            // generate OTP
            let OTP = generateOTP();
            let secret = null;

            // assign secret
            if (userData.user_role === "PUBLIC") {
              secret = process.env.USER_SECRET;
            } else if (userData.user_role === "ADMIN") {
              secret = process.env.ADMIN_SECRET;
            } else if (userData.user_role === "ICT") {
              secret = process.env.ICT_SECRET;
            }

            // generate JWTAUTH
            const JWTAUTH = jwt.sign(
              {
                username: loginCredentials.username
              },
              secret,
              {
                expiresIn: "1h"
              }
            );

            // create user session
            const temp = await Temp.create({
              otp: OTP,
              user_id: users[0].dataValues.user_id
            });

            res.status(200).json({
              OTP,
              JWTAUTH
            });
          } else {
            throw {
              error: "Wrong username or password",
              statusCode: 403
            };
          }
        }
      );
    } else {
      throw {
        error: "User does not exist",
        statusCode: 404
      };
    }
  } catch (err) {
    res.status(err.statusCode).json(err);
  }
};

module.exports = {
  addUser,
  registerUser,
  authenticateUser
};
