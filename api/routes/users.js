const express = require("express");
const router = express.Router();
const {
  registerUser,
  addUser,
  authenticateUser
} = require("../controllers/users");
const { authGuard, adminGuard } = require("../middleware/auth-guard");

/* Register user */
router.post("/register", registerUser);

// Add a user (for admin)
router.post("/add-user", adminGuard, addUser);

// Authenticate a user
router.post("/login", authenticateUser);

module.exports = router;
