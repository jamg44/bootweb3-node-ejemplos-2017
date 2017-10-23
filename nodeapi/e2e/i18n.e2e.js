const request = require('supertest');

// Inicializamos mockgoose
const Mockgoose = require('mockgoose').Mockgoose;
const mongoose = require('mongoose');
const mockgoose = new Mockgoose(mongoose);

const app = require('../app');

describe('Home', function() {

  before(async function() {//
    await mockgoose.prepareStorage();
    await mongoose.connect('mongodb://example.com/TestingDB', {
      useMongoClient: true
    });
    // limpiamos las definiciones de modelos y esquemas de mongoose
    mongoose.models = {};
    mongoose.modelSchemas = {};
  });

  // despues de cada test
  afterEach(function() {

  });


  it('should return 200', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  })

  it('should return 200', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  })

});