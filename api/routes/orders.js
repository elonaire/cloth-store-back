const express = require('express');
const router = express.Router();
const ordersControllers = require('../controllers/orders')
const { authGuard } = require('../middleware/auth-guard');

router.get('/', ordersControllers.fetchOrders);

router.post('/create', ordersControllers.createOrder);

router.patch('/edit/:id', ordersControllers.editOrder);

router.delete('/cancel/:id', ordersControllers.cancelOrder);

module.exports = router;