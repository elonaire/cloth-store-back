const Order = require("../models").Order;
const generateUUID = require("uuid/v4");

let fetchOrders = async (req, res, next) => {
  // fetch all
  try {
    console.log('here');
    let orders = await Order.findAll({
      where: {}
    });

    if (orders) {
      res.status(200).json(orders);
    } else {
      throw {
        error: "Orders not found",
        statusCode: 404
      };
    }
  } catch (error) {
    res.status(error.statusCode).json(error);
  }

  // fetch by filters - TODO
};

let createOrder = async (req, res, next) => {
  let order = req.body;

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "production"
  ) {
    order["order_id"] = generateUUID();
  }

  try {
    if (
      !order.order_id ||
      !order.quantity ||
      !order.delivery_details ||
      !order.status
    ) {
      throw {
        error: "Missing field",
        statusCode: 400
      };
    }

    let createdOrder = await Order.create(order);

    if (createdOrder) {
      res.status(201).json(createdOrder);
    } else {
      throw {
        error: "Order creation failed",
        statusCode: 400
      };
    }
  } catch (error) {
    res.status(error.statusCode).json(error);
  }
};

let cancelOrder = async (req, res, next) => {
  let order_id = req.params.id;

  try {
    let deleted = await Order.destroy({
      where: {
        order_id
      }
    });

    if (!deleted) {
      throw {
        error: "Order not found",
        statusCode: 404
      };
    }

    res.status(200).json({
      message: "Order deleted succesfully",
      deleted
    });
  } catch (error) {
    res.status(error.statusCode).json(error);
  }
};

let editOrder = async (req, res, next) => {
  let orderId = req.params.id;
  let changes = req.body;

  try {
    let order = await Order.findOne({
      where: {
        order_id
      }
    });

    if (!order) {
      throw {
        error: "Order not found",
        statusCode: 404
      };
    }

    let editedOrder = null;
    if (order) {
      editedOrder = await Order.update(changes, {
        where: {
          order_id: orderId
        }
      });

      if (editedOrder) {
        res.status(200).json({
          message: 'Edit Successful'
        });
      } else {
        throw {
          error: "Order was not edited",
          statusCode: 400
        };
      }
    }
  } catch (error) {
    res.status(error.statusCode).json(error);
  }
};

module.exports = {
  fetchOrders,
  createOrder,
  cancelOrder,
  editOrder
};
