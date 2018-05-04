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

  it('GET palette by id should return an error if palette is not found', done => {
    const paletteId = 3;

    chai.request(app)
      .get(`/api/v1/palettes/${paletteId}`)
      .send({
        id: paletteId
      })
      .end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.have.property('error');
        response.body.error.should.equal('Could not find palette with id 3');
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

  it('POST palette should create a new palette', done => {
    chai.request(app)
      .post('/api/v1/palettes')
      .send({
        palette_name: 'Palette3',
        project_id: '1',
        colors_array: [
            '#423B54',
            '#E9F6B5',
            '#514E28',
            '#6E974E',
            '#5D8807'
        ]
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.an('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(3);
        done();
      });
  });

  it('POST palette should not create a palette with missing data ', done => {
    chai.request(app)
      .post('/api/v1/palettes')
      .send({
        palette_name: 'Palette3',
        project_id: '1'
      })
      .end((err, response) => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.error.should.equal(`You're missing a colors_array property.`);
        done();
      });
  });

  it('DELETE palette should remove palette from database', done => {
    chai.request(app)
      .delete('/api/v1/palettes')
      .send({
        id: 1
      })
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('object');
        response.body.should.have.property('message');
        response.body.message.should.equal('Deleted palette with id 1');
        done();
      });
  });

  it('DELETE palette should not remove a palette when missing data', done => {
    chai.request(app)
      .delete('/api/v1/palettes')
      .send({})
      .end((err, response) => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.error.should.equal(`You're missing an id property.`);
        done();
      });
  });
});