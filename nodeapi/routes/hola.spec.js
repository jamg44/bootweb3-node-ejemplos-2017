'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const hola = require('./hola');

describe('router hola', function() { // suit de testing

  describe('GET index', function() {
    it('should render hola page', function() {
      const res = { render: sinon.spy() }; // ponemos un espia en res.render()
      hola.index({}, res, null);
      expect(res.render.callCount).to.equal(1);
    });

  });

});