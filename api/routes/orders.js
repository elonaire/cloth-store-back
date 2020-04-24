const express = require("express");
const router = express.Router();
const {
  fetchOrders,
  createOrder,
  editOrder,
  cancelOrder
} = require("../controllers/orders");
const { authGuard, adminGuard } = require("../middleware/auth-guard");

router.get("/", authGuard, fetchOrders);

router.get("/admin", adminGuard, fetchOrders);

router.post("/create", authGuard, createOrder);

router.patch("/edit/:id", authGuard, editOrder);

router.delete("/cancel/:id", authGuard, cancelOrder);

module.exports = router;
