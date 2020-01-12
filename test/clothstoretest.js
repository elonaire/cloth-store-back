process.env.NODE_ENV = "test";
const User = require("../api/models").User;

const chai = require("chai");
const chaiHttp = require("chai-http");
const api = require("../app");
const should = chai.should();

chai.use(chaiHttp);

describe("/users", () => {

  let user = {
    username: "test_user",
    firstName: "Test",
    lastName: "User",
    phone: "0704730039",
    email: "elonsantos63@gmail.com",
    password: "test123"
  };
  
  // test the registration end point
  describe("POST /users/register", () => {
    User.destroy({
      where: {},
      truncate: true
    });

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
          res.body.should.have.property('OTP');
          done();
        });
    });

    it("it should reject wrong user login credentials", done => {
      let wrongCredentials = {...correctCredentials};
      wrongCredentials.password = 'abujubuju';

      chai
        .request(api)
        .post("/users/login")
        .send(wrongCredentials)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a("object");
          User.destroy({
            where: {},
            truncate: true
          });
          done();
        });
    });
  });

  describe('POST /users/add-user', () => {
    it('it should allow the site admin to add a new user', done => {
      chai
      .request(api)
      .post('/users/add-user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
    });

    it('it should bar the site admin from adding a duplicate user', done => {
      chai
      .request(api)
      .post('/users/add-user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
    });
  });
});
