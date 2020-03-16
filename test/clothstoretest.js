process.env.NODE_ENV = "test";
const User = require('../api/seeders/user').User;
const generateNewUser = require('../api/seeders/user').generateNewUser;
const Product = require('../api/seeders/products').Product;
const generateProduct = require('../api/seeders/products').generateProduct;
const createOrder = require('../api/seeders/orders').createOrder;
const Order = require('../api/seeders/orders').Order;

const chai = require("chai");
const chaiHttp = require("chai-http");
const api = require("../app");
const should = chai.should();

chai.use(chaiHttp);

let user;

describe("/users", () => {
  // test the registration end point
  user = generateNewUser(User);
  
  describe("POST /users/register", () => {
    // test adding a new user to the DB
    it("it should POST a new user during PUBLIC user registration", done => {
      chai
        .request(api)
        .post("/users/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          done();
        });
    });

    // test adding an already existing user
    it("it should not POST a duplicate user", done => {
      chai
        .request(api)
        .post("/users/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a("object");
          done();
        });
    });

    // test adding a user with some missing information
    it("it should not POST a new user with any missing fields", done => {
      let duplicateUser = { ...user };
      delete duplicateUser.username;

      chai
        .request(api)
        .post("/users/register")
        .send(duplicateUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  // test the login end point
  describe("POST /users/login", () => {
    let { username, password } = user;
    let correctCredentials = {
      username,
      password
    };

    it("it should accept correct user login credentials", done => {
      chai
        .request(api)
        .post("/users/login")
        .send(correctCredentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("OTP");
          done();
        });
    });

    it("it should reject wrong user login credentials", done => {
      let wrongCredentials = { ...correctCredentials };
      wrongCredentials.password = "abujubuju";

      chai
        .request(api)
        .post("/users/login")
        .send(wrongCredentials)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("POST /users/add-user", () => {
    it("it should allow the site admin to add a new user", done => {
      user = generateNewUser(User);
      chai
        .request(api)
        .post("/users/add-user")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });

    it("it should bar the site admin from adding a duplicate user", done => {
      chai
        .request(api)
        .post("/users/add-user")
        .send(user)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });
});

describe("/products", () => {
  let product = generateProduct(Product);

  it("it should add a new product", done => {
    chai
      .request(api)
      .post("/products/add")
      .send(product)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        done();
      });
  });

  it("it should get products", done => {
    chai
      .request(api)
      .get("/products")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });

  it("it should edit a product", done => {
    product.name = "Gucci sweater";
    chai
      .request(api)
      .patch("/products/edit/" + product.product_id)
      .send(product)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("it should delete a product", done => {
    chai
      .request(api)
      .delete("/products/delete/" + product.product_id)
      .send(product)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('/orders', () => {
  let order = createOrder(Order);

  it("it should create a new order", done => {
    chai
      .request(api)
      .post("/orders/create")
      .send(order)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        done();
      });
  });

  it("it should get orders", done => {
    chai
      .request(api)
      .get("/orders")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });

  it("it should edit an order", done => {
    order.quantity = 4;
    chai
      .request(api)
      .patch("/orders/edit/" + order.order_id)
      .send(order)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("it should cancel an order", done => {
    chai
      .request(api)
      .delete("/orders/cancel/" + order.order_id)
      .send(order)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
