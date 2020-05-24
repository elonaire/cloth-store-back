const { Order, User, Product, UserOrder, ProductOrder } = require("../models");
const generateUUID = require("uuid/v4");
const jwt = require("jsonwebtoken");

let fetchOrders = async (req, res, next) => {
  let filter = {};
  let limit = null;

  let queryOrders = async (table) => {
    // fetch all
    try {
      console.log("here");
      let orders = await table.findAll({
        where: filter,
        limit,
      });

      if (orders) {
        res.status(200).json(orders);
      } else {
        throw {
          error: "Orders not found",
          statusCode: 404,
        };
      }
    } catch (error) {
      res.status(error.statusCode).json(error);
    }
  };

  // specific order
  if (req.query.order_id) {
    filter["order_id"] = req.query.order_id;
    limit = 1;
    queryOrders(Order);
  } else if (req.query.user_id) { // orders for a specific user
    filter["user_id"] = req.query.user_id;
    queryOrders(UserOrder);
  } else if (req.product_id) {
    filter["product_id"] = req.query.product_id;
    queryOrders(ProductOrder);
  } else {
    queryOrders(Order);
  }

  // fetch by filters - TODO
};

let createOrder = async (req, res, next) => {
  let order = req.body;
  let token = req.get("Authorization");
  let decoded = jwt.decode(token);
  console.log("order", order);

  let currentUser = decoded.username;

  let user = await User.findOne({
    where: {
      username: currentUser,
    },
  });

  if (user) {
    // console.log('user', user);
    order["user_id"] = user.dataValues.user_id;
  }

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
      !order.status ||
      !order.product_id ||
      !order.user_id
    ) {
      throw {
        error: "Missing field(s)",
        statusCode: 400,
      };
    }

    let productDetails = await Product.findOne({
      where: {
        product_id: order.product_id,
      },
    });

    if (productDetails) {
      console.log("product details", productDetails);
      let stock = productDetails.dataValues.stock;
      if (stock < order.quantity) {
        throw {
          error: `Out of stock. Only ${stock} pieces left.`,
          statusCode: 406,
        };
      } else {
        let newStock = stock - order.quantity;
        let update = {
          stock: newStock,
        };

        let updatedProduct = await Product.update(update, {
          where: {
            product_id: order.product_id,
          },
        });

        if (!updatedProduct) {
          throw {
            error: `Unable to place order.`,
            statusCode: 400,
          };
        }
      }
    } else {
      throw {
        error: `Product not found.`,
        statusCode: 404,
      };
    }

    let createdOrder = await Order.create(order);

    if (createdOrder) {
      res.status(201).json(createdOrder);
    } else {
      throw {
        error: "Order creation failed",
        statusCode: 400,
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
        order_id,
      },
    });

    if (!deleted) {
      throw {
        error: "Order not found",
        statusCode: 404,
      };
    }

    res.status(200).json({
      message: "Order deleted succesfully",
      deleted,
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
        order_id: orderId,
      },
    });

    if (!order) {
      throw {
        error: "Order not found",
        statusCode: 404,
      };
    }

    let editedOrder = null;
    if (order) {
      editedOrder = await Order.update(changes, {
        where: {
          order_id: orderId,
        },
      });

      if (editedOrder) {
        res.status(200).json({
          message: "Edit Successful",
        });
      } else {
        throw {
          error: "Order was not edited",
          statusCode: 400,
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
  editOrder,
};
