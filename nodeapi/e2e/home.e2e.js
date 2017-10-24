const request = require('supertest');

// Inicializamos mockgoose
const Mockgoose = require('mockgoose').Mockgoose;
const mongoose = require('mongoose');
const mockgoose = new Mockgoose(mongoose);
const mongodbFixtures = require('./mongodb.fixtures');

const app = require('../app');

describe('Home', function() {

  let agent;

  before(async function() {//
    await mockgoose.prepareStorage();
    await mongoose.connect('mongodb://example.com/TestingDB', {
      useMongoClient: true
    });
    // limpiamos las definiciones de modelos y esquemas de mongoose
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await mongodbFixtures.initUsuarios();    
    agent = request.agent(app);
  });

  // despues de cada test
  afterEach(function() {

  });


  it('should redirect to login without authenticated user', function(done) {
    agent
      .get('/')
      .expect('Location', /\/login/)
      .expect(302, done);
  })

  it('/login should log the user', function(done) {
    agent
      .post('/login')
      .send({ email: 'admin@example.com', password: '1234' })
      .expect('Location', /\//)
      .expect(302, done);
  })

  it('should return 200', function(done) {
    agent
      .get('/')
      .expect(200, done);
  })

});