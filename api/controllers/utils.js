let generateOTP = () => {
    let OTP = '';
    for(let i = 0; i < 6; i++) {
        with(Math) {
            OTP += floor(random() * 10).toString();
        }
    }

    return OTP;
}

let generatePhoneNo = () => {
    let phone = '07';
    for(let i = 0; i < 8; i++) {
        with(Math) {
            phone += floor(random() * 10).toString();
        }
    }

    return phone;
}

module.exports = {
    generateOTP,
    generatePhoneNo
};