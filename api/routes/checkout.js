const express = require("express");
const router = express.Router();
const { authGuard } = require("../middleware/auth-guard");
const { makePayment } = require("../controllers/checkout");

router.post("/", authGuard, makePayment);

module.exports = router;
