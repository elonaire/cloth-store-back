const express = require('express');
const router = express.Router();
const ordersControllers = require('../controllers/orders')
const authGuard = require('../middleware/auth-guard').authGuard;

router.get('/', authGuard, ordersControllers.fetchOrders);

router.post('/create', authGuard, ordersControllers.createOrder);

router.patch('/edit/:id', authGuard, ordersControllers.editOrder);

router.delete('/cancel/:id', authGuard, ordersControllers.cancelOrder);

module.exports = router;