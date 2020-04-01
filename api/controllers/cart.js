const { Cart, User } = require("../models");
const jwt = require("jsonwebtoken");

const fetchCartItems = async (req, res, next) => {
  let token = req.get("Authorization");
  let decoded = jwt.decode(token);
  let currentUser = decoded.username;
  let user_id;

  try {
    let currentUserDetails = await User.findOne({
      where: {
        username: currentUser
      }
    });

    if (currentUserDetails) {
      user_id = currentUserDetails.dataValues.user_id;
    }

    let cartItems = await Cart.findAll({
      where: {
        user_id
      }
    });

    if (cartItems.length === 0) {
      throw {
        error: "No items found in cart",
        statusCode: 404
      };
    }

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(error.statusCode).json(error);
  }
};

const addToCart = async (req, res, next) => {
  let cartItem = req.body;
  console.log("itm", cartItem);

  let token = req.get("Authorization");
  let decoded = jwt.decode(token);
  let currentUser = decoded.username;
  let user_id;

  try {
    let currentUserDetails = await User.findOne({
      where: {
        username: currentUser
      }
    });

    if (currentUserDetails) {
      user_id = currentUserDetails.dataValues.user_id;
      cartItem["user_id"] = user_id;
    }

    let addedToCart = await Cart.create(cartItem);

    if (!addedToCart) {
      throw {
        error: "Failed to add to cart",
        statusCode: 400
      };
    }

    res.status(201).json(addedToCart);
  } catch (error) {
    res.status(error.statusCode).json(error);
  }
};

const editCart = async (req, res, next) => {
  let product_id = req.params.id;
  let update = req.body;
  let token = req.get("Authorization");
  let decoded = jwt.decode(token);
  let currentUser = decoded.username;
  let user_id;

  try {
    let currentUserDetails = await User.findOne({
      where: {
        username: currentUser
      }
    });

    if (currentUserDetails) {
      user_id = currentUserDetails.dataValues.user_id;
    }

    let updated = await Cart.update(update, {
      where: {
        product_id,
        user_id
      }
    });

    if (!updated) {
      throw {
        error: "Cart update failed",
        statusCode: 500
      };
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(error.statusCode).json(error);
  }
};

const removeFromCart = async (req, res, next) => {
  let product_id = req.params.id;
  let token = req.get("Authorization");
  let decoded = jwt.decode(token);
  let currentUser = decoded.username;
  let user_id;

  try {
    let currentUserDetails = await User.findOne({
      where: {
        username: currentUser
      }
    });

    if (currentUserDetails) {
      user_id = currentUserDetails.dataValues.user_id;
    }

    let deleted = await Cart.destroy({
      where: {
        product_id,
        user_id
      }
    });
    

    res.status(200).json(deleted);
  } catch (error) {
    res.status(error.statusCode).json(error);
  }
};

module.exports = {
  fetchCartItems,
  addToCart,
  removeFromCart,
  editCart
};
