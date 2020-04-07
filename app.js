const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const indexRouter = require("./api/routes/index");
const usersRouter = require("./api/routes/users");
const productsRouter = require("./api/routes/products");
const ordersRouter = require("./api/routes/orders");
const blogRouter = require("./api/routes/blog");
const cartRouter = require("./api/routes/cart");
const checkoutRouter = require("./api/routes/checkout");

const app = express();
var whitelist = ["http://localhost:3000", "http://nimonaturals.com"];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
  app.use("/", cors(corsOptions), indexRouter);
  app.use("/users", cors(corsOptions), usersRouter);
  app.use("/products", cors(corsOptions), productsRouter);
  app.use("/orders", cors(corsOptions), ordersRouter);
  app.use("/blog", cors(corsOptions), blogRouter);
  app.use("/cart", cors(corsOptions), cartRouter);
  app.use("/checkout", cors(corsOptions), checkoutRouter);
} else if (process.env.NODE_ENV === "test") {
  app.use("/", indexRouter);
  app.use("/users", usersRouter);
  app.use("/products", productsRouter);
  app.use("/orders", ordersRouter);
  app.use("/blog", blogRouter);
  app.use("/cart", cartRouter);
  app.use("/checkout", checkoutRouter);
}

app.get('/callback', (req, res, next) => {
  console.log(req);
  
})

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json(err);
  } else {
    res.status(404).json({
      message: "Resource not found"
    });
  }
});

module.exports = app;
