const jwt = require('json-web-token');
const generateUUID = require('hat');

// Add a user (for admin)
exports.addUser = (req, res, next) => {

}

// Register a new public user
exports.registerUser = (req, res, next) => {
    let userDetails = req.body;
    if (userDetails.firstName && userDetails.lastName && userDetails.phone && userDetails.email && userDetails.password) {
        userDetails['userID'] = generateUUID();
        res.status(201).json({
            message: 'User added successfully!',
            userDetails
        });
    }
    res.status(400).json({
        message: 'ensure payload has all the required information'
    })
}

// authenticate a user
exports.authenticateUser = (req, res, next) => {

}