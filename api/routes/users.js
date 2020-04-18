const express = require("express");
const router = express.Router();
const {
  registerUser,
  // addUser,
  authenticateUser,
  fetchUsers
} = require("../controllers/users");
const { authGuard, adminGuard } = require("../middleware/auth-guard");
// fetch users
router.get('/', fetchUsers)

/* Register user */
router.post("/register", registerUser);

// Add a user (for admin)
router.post("/add-user", adminGuard, registerUser);

// Authenticate a user
router.post("/login", authenticateUser);

module.exports = router;
