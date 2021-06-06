const names = require('human-names');
const generatePhoneNo = require('../../controllers/utils').generatePhoneNo;
const generateUUID = require("hat");
const bcrypt = require("bcryptjs");

class User {
  constructor(
    username,
    first_name,
    last_name,
    user_role,
    gender,
    phone,
    user_id,
    email,
    password,
    createdAt,
    updatedAt
  ) {
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.user_role = user_role;
    this.gender = gender;
    this.phone = phone;
    this.user_id = user_id;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

let generateNewUser = (userClass, role = 'PUBLIC') => {
  let nameGenders = ['femaleRandom', 'maleRandom'];
  let nameGender = nameGenders[Math.floor(Math.random() * 2)];
  let firstName = null;
  let lastName = null;
  let gender = null;
  let phone = generatePhoneNo();
  let user_role = role;
  let user_id = generateUUID();

  if (nameGender === 'femaleRandom') {
    gender = 'FEMALE';
    firstName = names.femaleRandom();
    lastName = names.femaleRandom();
  } else {
    gender = 'MALE';
    firstName = names.maleRandom();
    lastName = names.maleRandom();
  }

  let username = `${firstName + lastName}`.toLowerCase();
  let email = `${username}@gmail.com`;
  let password = 'test_123';

  // encrypt password
  let salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);

  let user = new userClass(
    username,
    firstName,
    lastName,
    user_role,
    gender,
    phone,
    user_id,
    email,
    password,
    new Date(),
    new Date()
  );

  return user;
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [generateNewUser(User, 'ADMIN')]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
