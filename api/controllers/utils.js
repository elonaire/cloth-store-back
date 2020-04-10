let bcrypt = require("bcryptjs");

let generateOTP = () => {
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    with (Math) {
      OTP += floor(random() * 10).toString();
    }
  }

  return OTP;
};

let generatePhoneNo = () => {
  let phone = "07";
  for (let i = 0; i < 8; i++) {
    with (Math) {
      phone += floor(random() * 10).toString();
    }
  }

  return phone;
};

let generateHash = (password) => {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
        
    });
  });
};

module.exports = {
  generateOTP,
  generatePhoneNo,
  generateHash
};
