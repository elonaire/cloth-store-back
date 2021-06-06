const express = require("express");
const router = express.Router();
const {
  registerUser,
  editUser,
  authenticateUser,
  fetchUsers,
  deleteUser
} = require("../controllers/users");
const { authGuard, adminGuard } = require("../middleware/auth-guard");
// fetch users
router.get('', adminGuard, fetchUsers)

/* Register user */
router.post("/register", registerUser);

// Add a user (for admin)
router.post("/add-user", adminGuard, registerUser);

// Authenticate a user
router.post("/login", authenticateUser);

// Admin edit user
router.patch("/edit/:id", adminGuard, editUser);

// Edit user details
router.patch("/edit-profile/:id", authGuard, editUser);

// Delete a user
router.delete("/delete/:id", adminGuard, deleteUser);

module.exports = router;
