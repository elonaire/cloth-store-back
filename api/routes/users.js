const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/users');

/* Register user */
router.post('/register', usersControllers.registerUser);

// Add a user (for admin)
router.post('/add-user', usersControllers.addUser);

// Authenticate a user
router.post('login', usersControllers.authenticateUser);

module.exports = router;
