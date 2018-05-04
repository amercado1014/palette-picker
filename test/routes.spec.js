const chai = require('chai');
const should = chai.should();

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('Testing endpoints', () => {
 it('GET all projects', (done) => {
  chai.request(server)
    .get('/api/v1/projects')
    .end((err, response) => {
      response.should.be.json;
      response.should.have.status(200);
      done();
    })
 });
});