// Required Libraries
const chai = require("chai")
const mongoose = require('mongoose')
const chaiHttp = require('chai-http');

const app = require("../index")
chai.use(chaiHttp);
chai.should();

describe("site", function() {
it("Should be able to see homepage", () => {
    chai.request(app.app)
        .get('/')
        .end((err, res) => {
            res.should.have.status(200);
         });
});
});
after((done) => {
  done()
})