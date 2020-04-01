process.env.NODE_ENV = "test";
const { User, generateNewUser } = require("../api/seeders/user");
const { Product, generateProduct } = require("../api/seeders/products");
const { Order, createOrder } = require("../api/seeders/orders");
const { BlogPost, createNewBlogPost } = require("../api/seeders/blog");

const chai = require("chai");
const chaiHttp = require("chai-http");
const api = require("../app");
const should = chai.should();

chai.use(chaiHttp);

let user;
let JWTAUTH;
let admin;
let ADMINAUTH;
let sampleProductId;
let order;

describe("/users", () => {
  // test the registration end point
  user = generateNewUser(User);
  admin = generateNewUser(User, "ADMIN");

  describe("POST /users/register", () => {
    // test adding a new PUBLIC user to the DB
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

    // test adding a new SUPERUSER user to the DB
    it("it should POST a new SUPER user", done => {
      chai
        .request(api)
        .post("/users/register")
        .send(admin)
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

    it("it should accept correct PUBLIC user login credentials", done => {
      chai
        .request(api)
        .post("/users/login")
        .send(correctCredentials)
        .end((err, res) => {
          JWTAUTH = res.body.JWTAUTH;
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("OTP");
          done();
        });
    });

    it("it should accept correct SUPER user login credentials", done => {
      let { username, password } = admin;
      let correctAdminCredentials = {
        username,
        password
      };
      chai
        .request(api)
        .post("/users/login")
        .send(correctAdminCredentials)
        .end((err, res) => {
          ADMINAUTH = res.body.JWTAUTH;
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
        .set("Authorization", ADMINAUTH)
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
        .set("Authorization", ADMINAUTH)
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
  let product2 = generateProduct(Product);

  it("it should add a new product", done => {
    chai
      .request(api)
      .post("/products/add")
      .set("Authorization", ADMINAUTH)
      .send(product)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        done();
      });
  });

  it("it should add another product", done => {
    chai
      .request(api)
      .post("/products/add")
      .set("Authorization", ADMINAUTH)
      .send(product2)
      .end((err, res) => {
        sampleProductId = res.body.product_id;
        console.log('samp', sampleProductId);
        order = createOrder(Order, sampleProductId);
        
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
      .set("Authorization", ADMINAUTH)
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
      .set("Authorization", ADMINAUTH)
      .send(product)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe("/orders", () => {
  it("it should create a new order", done => {
    chai
      .request(api)
      .post("/orders/create")
      .set("Authorization", JWTAUTH)
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
      .set("Authorization", JWTAUTH)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });

  it("it should edit an order", done => {
    order.quantity = 4;
    chai
      .request(api)
      .patch("/orders/edit/" + order.order_id)
      .set("Authorization", JWTAUTH)
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
      .set("Authorization", JWTAUTH)
      .send(order)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe("/blog", () => {
  let post = createNewBlogPost(BlogPost);

  it("it should create a new blog post", done => {
    chai
      .request(api)
      .post("/blog/create")
      .set("Authorization", ADMINAUTH)
      .send(post)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        done();
      });
  });

  it("it should get blog posts", done => {
    chai
      .request(api)
      .get("/blog")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });

  it("it should edit a blog post", done => {
    post.author = "Nellies Aseneka";
    chai
      .request(api)
      .patch("/blog/edit/" + post.post_id)
      .set("Authorization", ADMINAUTH)
      .send(post)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("it should delete a blog post", done => {
    chai
      .request(api)
      .delete("/blog/delete/" + post.post_id)
      .set("Authorization", ADMINAUTH)
      .send(post)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe("/cart", () => {
  let cartItem = {
    quantity: 5,
    product_id: sampleProductId
  }

  it("it should add a new item to the cart", done => {
    chai
      .request(api)
      .post("/cart/add")
      .set("Authorization", JWTAUTH)
      .send(cartItem)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        done();
      });
  });

  it("it should get cart items for the logged in user", done => {
    chai
      .request(api)
      .get("/cart")
      .set("Authorization", JWTAUTH)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });

  it("it should edit an item in the cart", done => {
    cartItem.quantity = 9;
    chai
      .request(api)
      .patch("/cart/edit/" + sampleProductId)
      .set("Authorization", JWTAUTH)
      .send(cartItem)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("it should remove an item from the cart", done => {
    chai
      .request(api)
      .delete("/cart/remove/" + sampleProductId)
      .set("Authorization", JWTAUTH)
      .send(cartItem)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
