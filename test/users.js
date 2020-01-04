process.env.NODE_ENV = "test";
const User = require("../api/models").User;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const chai = require("chai");
const chaiHttp = require("chai-http");
const api = require("../app");
const should = chai.should();

chai.use(chaiHttp);

describe("Users", () => {
  beforeEach(done => {
    // User.destroy({
    //   where: {},
    //   truncate: true
    // });

    done();
  });

  describe("/POST register user", () => {
    User.destroy({
      where: {},
      truncate: true
    });

    let user = {
      username: "test_user",
      firstName: "Test",
      lastName: "User",
      phone: "0704730039",
      email: "elonsantos63@gmail.com",
      password: "test123"
    };

    it("it should POST a new user", done => {
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

    it("it should not POST a duplicate user", done => {
      let userExists = false;

      User.findAll({
        where: {
          [Op.or]: [
            { username: user.username },
            { email: user.email },
            { phone: user.phone }
          ]
        }
      }).then(users => {
        if (users.length > 0) {
          userExists = true;
        }

        if (userExists) {
          chai
            .request(api)
            .post("/users/register")
            .send(user)
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a("object");
              done();
            });
        }
      });
    });

    it("it should not POST a new user in case of any missing fields", done => {
      let user = {
        username: "test_user",
        firstName: "Test",
        lastName: "User",
        email: "elonsantos63@gmail.com",
        password: "test123"
      };

      chai
        .request(api)
        .post("/users/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          done();
        });
    });
  });
});
