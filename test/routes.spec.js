const chai = require('chai');
const should = chai.should();
const { app, database } = require('../server');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('API Routes', () => {
  beforeEach(done => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
          .then(() => {
            return database.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  it('GET projects should return all the projects', done => {
    chai.request(app)
      .get('/api/v1/projects')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('project_name');
        response.body[0].project_name.should.equal('Project1');
        done();
      });
  });

  it('GET palettes should return all of the palettes', done => {
    chai.request(app)
      .get('/api/v1/palettes')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('palette_name');
        response.body[0].palette_name.should.equal('Palette1');
        response.body[0].should.have.property('colors_array');
        response.body[0].colors_array.should.be.an('array');
        response.body[0].colors_array.length.should.equal(5);
        done();
      });
  });

  it('GET palette by id should return a single palette', done => {
    const paletteId = 1;

    chai.request(app)
      .get(`/api/v1/palettes/${paletteId}`)
      .send({
        id: paletteId
      })
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('palette_name');
        response.body[0].palette_name.should.equal('Palette1');
        response.body[0].should.have.property('colors_array');
        response.body[0].colors_array.should.be.an('array');
        response.body[0].colors_array.length.should.equal(5);
        done();
      });
  });

  it('POST project should create a new project', done => {
    chai.request(app)
      .post('/api/v1/projects')
      .send({
        project_name: 'Project2'
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.an('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(2);
        done();
      });
  });

  it('POST project should not create a project with missing data ', done => {
    chai.request(app)
      .post('/api/v1/projects')
      .send({})
      .end((err, response) => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.error.should.equal(`Expected format: { project_name: <String> }. You're missing a project_name property.`);
        done();
      });
  });
});