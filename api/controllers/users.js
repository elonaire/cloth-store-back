const jwt = require('jsonwebtoken');
const generateUUID = require('hat');
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { generateOTP } = require('./utils');
// const moment = require('moment');
const EventEmitter = require('events');
class Job extends EventEmitter {}
let createUser = new Job();
// const { sendMail } = require('./mailer');

const { User, Temp, UserPointAward } = require('../models');

let fetchUsers = async (req, res, next) => {
  let filter = {};
  let limit = null;

  if (req.query.user_id) {
    filter['user_id'] = req.query.user_id;
    limit = 1;
  }

  try {
    console.log('here');
    let users = await User.findAll({
      where: filter,
      limit,
    });

    if (users) {
      res.status(200).json(users);
    } else {
      throw {
        error: 'Users not found',
        statusCode: 404,
      };
    }
  } catch (error) {
    res.locals.error = err;
    next();
  }
};

// Register a new public user
let registerUser = async (req, res, next) => {
  let userDetails = req.body;
  let userExists = false;
  console.log('dets', userDetails);

  try {
    Object.keys(userDetails).forEach((field) => {
      if (!userDetails[field]) {
        throw {
          error: 'ensure the payload has all the required information',
          statusCode: 400,
        };
      }
    });

    let users = await User.findAll({
      where: {
        [Op.or]: [
          { username: userDetails.username },
          { email: userDetails.email },
          { phone: userDetails.phone },
        ],
      },
    });

    console.log('passes db check');

    if (users.length > 0) {
      userExists = true;
    }

    if (userExists) {
      res.status(403).json({
        message: 'User already exists',
      });
    } else {
      // encrypt password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(userDetails.password, salt, async (err, hash) => {
          // generate userID
          userDetails['user_id'] = generateUUID();

          try {
            let userRole = userDetails.user_role
              ? userDetails.user_role
              : 'PUBLIC';
            console.log(userRole);

            let user = {};
            let userRoleIsDefined = false;

            for (let field of Object.keys(userDetails)) {
              if (field === 'user_role') {
                userRoleIsDefined = true;
              }
              if (field === 'password') {
                user[field] = hash;
              } else {
                user[field] = userDetails[field];
              }
            }

            if (!userRoleIsDefined) {
              user['user_role'] = userRole;
            }

            console.log('built', user);

            let createdUser = await User.create(user);

            const points = await UserPointAward.create({
              user_id: user['user_id'],
            });

            res.status(201).json(createdUser);
          } catch (error) {
            (error) => res.status(400).json(error);
          }
        });
      });
    }
  } catch (err) {
    res.locals.error = err;
    next();
  }
};

// Edit a user (for admin & user)
let editUser = async (req, res, next) => {
  let userId = req.params.id;
  let changes = req.body;

  try {
    let requester = await User.findOne({
      where: {
        username: res.locals.decodedToken.username,
      },
    });

    let adminAllowedEdits = ['user_role'];
    let userAllowedEdits = ['username', 'phone', 'email', 'password'];

    let authorizeEdit = (allowedEdits, changesObj) => {
      let count = 0;
      let reqEditsKeys = Object.keys(changesObj);
      if (reqEditsKeys.length <= allowedEdits.length) {
        reqEditsKeys.forEach((changesKey) => {
          allowedEdits.forEach((allowedEdit) => {
            if (changesKey === allowedEdit) {
              count += 1;
            }
          });
        });
        if (count < reqEditsKeys.length) {
          throw {
            error: 'Forbidden!',
            statusCode: 403,
          };
        }
        return;
      }

      throw {
        error: 'Forbidden!',
        statusCode: 403,
      };
    };

    if (requester.dataValues.user_role === 'ADMIN') {
      authorizeEdit(adminAllowedEdits, changes);
    } else if (requester.dataValues.user_role === 'PUBLIC') {
      // check if requester is same as user
      if (requester.dataValues.user_id !== userId) {
        throw {
          error: 'Forbidden',
          statusCode: 403,
        };
      }
      authorizeEdit(userAllowedEdits, changes);
    }

    let user = await User.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!user) {
      throw {
        error: 'Edit not successful',
        statusCode: 400,
      };
    }

    let editedUser = null;
    if (user) {
      editedUser = await User.update(changes, {
        where: {
          user_id: userId,
        },
      });

      if (editedUser) {
        res.status(200).json({
          message: 'Edit Successful',
        });
      } else {
        throw {
          error: 'Edit not successful',
          statusCode: 400,
        };
      }
    }
  } catch (err) {
    res.locals.error = err;
    next();
  }
};

// authenticate a user
let authenticateUser = async (req, res, next) => {
  let loginCredentials = req.body;
  console.log('loginCredentials', loginCredentials);
  try {
    let user = await User.findOne({
      where: {
        username: loginCredentials.username,
      },
    });

    console.log('user', user);

    if (user) {
      let userData = user.dataValues;
      let isMatched = await bcrypt.compare(
        loginCredentials.password,
        userData.password
      );

      if (isMatched) {
        // generate OTP
        let OTP = generateOTP();
        let secret = null;

        // assign secret
        if (userData.user_role === 'PUBLIC') {
          secret = process.env.USER_SECRET;
        } else if (userData.user_role === 'ADMIN') {
          secret = process.env.ADMIN_SECRET;
        } else if (userData.user_role === 'ICT') {
          secret = process.env.ICT_SECRET;
        }

        // generate JWTAUTH
        const JWTAUTH = jwt.sign(
          {
            username: loginCredentials.username,
          },
          secret,
          {
            expiresIn: '1h',
          }
        );

        // store OTP
        const temp = await Temp.create({
          otp: OTP,
          user_id: user.dataValues.user_id,
        });

        // sendMail({
        //   senderName: 'Elon Aseneka',
        //   senderAddress: 'elonsantos63@gmail.com',
        //   recipients: ['elonsantos63@gmail.com'],
        //   subject: 'Hello',
        //   plainText: 'Hello World',
        //   htmlBody: `<p><b>OTP: </b>${OTP}</p>`,
        // });

        if (!temp) {
          throw {
            error: 'User session creation failed',
            statusCode: 400,
          };
        }

        res.status(200).json({
          OTP,
          JWTAUTH,
          user: {
            userId: user.user_id,
            userRole: user.user_role,
          },
        });
      } else {
        console.log('first');

        throw {
          error: 'Wrong username or password',
          statusCode: 401,
        };
      }
    } else {
      throw {
        error: 'Wrong username or password',
        statusCode: 401,
      };
    }
  } catch (err) {
    console.log('err', err);
    res.locals.error = err;
    next();
  }
};

let deleteUser = async (req, res, next) => {
  let user_id = req.params.id;

  try {
    let deleted = await User.destroy({
      where: {
        user_id,
      },
    });

    if (!deleted) {
      throw {
        error: 'User not found',
        statusCode: 404,
      };
    }

    res.status(200).json({
      message: 'User deleted succesfully',
      deleted,
    });
  } catch (err) {
    res.locals.error = err;
    next();
  }
};

module.exports = {
  editUser,
  registerUser,
  authenticateUser,
  fetchUsers,
  deleteUser,
};
