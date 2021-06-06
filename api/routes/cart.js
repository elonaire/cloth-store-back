const express = require("express");
const router = express.Router();
const {
  fetchCartItems,
  addToCart,
  removeFromCart,
  editCart
} = require("../controllers/cart");
const { authGuard } = require("../middleware/auth-guard");

router.get("", authGuard, fetchCartItems);

router.post("/add", authGuard, addToCart);

router.patch("/edit/:id", authGuard, editCart);

router.delete("/remove/:id", authGuard, removeFromCart);

module.exports = router;
