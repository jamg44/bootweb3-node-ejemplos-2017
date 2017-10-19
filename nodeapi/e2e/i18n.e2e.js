const request = require('supertest');
const app = require('../app');

describe('Home', function() {

  it('should return 200', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  })
});