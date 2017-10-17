const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Calculadora = require('./calculadora');

describe('calculadora', function() {

  let calculadora;

  beforeEach(function() {
    calculadora = new Calculadora();
  });

  it('sum() should return 0 if no arguments are passed in', function() {
    expect(calculadora.sum()).to.equal(0);
  });

  it('sum() should return the sum of 10 and 15', function() {
    expect(calculadora.sum(10, 15)).to.equal(25);
  });

  it('sum() should have commutative property', function() {
    const result1 = calculadora.sum(10, 15);
    const result2 = calculadora.sum(15, 10);
    expect(result1).to.equal(result2);
  });

  it('sumAfter() should execute callback function with the result', function(done) {
    // hacer mock de sum() para que no dependa de el
    sinon.stub(calculadora, 'sum').returns(25);
    calculadora.sumAfter(10, 15, 10, resultado => {
      expect(resultado).to.be.not.undefined;
      calculadora.sum.restore(); // limpiamos el stub
      done();
    });
  });

  it('sumAfter() should call sum() to obtain the result', function(done) {
    // hacer mock de sum() para que no dependa de el
    sinon.stub(calculadora, 'sum').returns(25);
    calculadora.sumAfter(10, 15, 10, resultado => {
      expect(calculadora.sum.firstCall.args).to.deep.equal([10, 15]);
      calculadora.sum.restore(); // limpiamos el stub
      done();
    });
  });

  it('object should be deep equal other object', function() {
    expect({ok: true}).to.deep.equal({ok: true});
  });

  it('object should be equal to same object', function() {
    const objeto = {ok: true};
    // imaginemos que testamos un método que tiene que devolver el 
    // mismo objeto que le dimos
    // no usamos .deep
    expect(objeto).to.equal(objeto);
  });

  it('subtract() should return subtract', function() {
    expect(calculadora.subtract(20, 5)).to.equal(15);
  });

  it('subtract() should not have commutative property', function() {
    const result1 = calculadora.subtract(20, 5);
    const result2 = calculadora.subtract(5, 20);
    expect(result1).to.not.equal(result2);
  });

  // "7 + 5 - 20" = [7, '+', 5, '-', 20]
  it('parse() should decompose expression and returns the array', function() {
    expect(calculadora.parse('4 + 6')).to.deep.equal([4, '+', 6]);
  })

  it('parse() should decompose expression and returns other array', function() {
    expect(calculadora.parse('5 + 8')).to.deep.equal([5, '+', 8]);
  })

  it('parse() should decompose expression 1 + 2 + 3', function() {
    expect(calculadora.parse('1 + 2 + 3')).to.deep.equal([1, '+', 2, '+', 3]);
  });

  it('parse() should decompose expression 1 - 6', function() {
    expect(calculadora.parse('1 - 6')).to.deep.equal([1, '-', 6]);
  });

  it('parse() should throw exception with to operators (1 - + 6)', function() {
    const throwingFunction = calculadora.parse.bind(calculadora, '1 - + 6');
    // expect(  () => calculadora.parse('1 - + 6')   ).to.not.throw();
    expect( throwingFunction ).to.throw('Unexpected item + found');
  });

  it('parse should throw exception with "1 + A"', function() {
    expect( () => { calculadora.parse('1 + A') } )
      .to.throw('Unknown item A found');
  });

  it('parse() should throw exception with "1 + 2 6"', function() {
    expect( () => { calculadora.parse('1 + 2 6') })
      .to.throw('Unexpected item 6 found');
  });
  describe('eval()', function() {

    it('should compute 6 + 7', function() {
      sinon.stub(calculadora, 'parse').callsFake(() => {
        return [6, '+', 7];
      });
      expect(calculadora.eval('6 + 7')).to.equal(13);
      calculadora.parse.restore();
    });

    it('should compute 3 + 4 + 3', function() {
      sinon.stub(calculadora, 'parse').callsFake(() => {
        return [3, '+', 4, '+', 3];
      });
      expect(calculadora.eval('3 + 4 + 3')).to.equal(10);
      calculadora.parse.restore();
    });

    it('should compute 3 + 4 + 3 + 10 + 11', function() {
      expect(calculadora.eval('3 + 4 + 3 + 10 + 11')).to.equal(31);
    });

    it('should compute 3 + 4 - 2', function() {
      expect(calculadora.eval('3 + 4 - 2')).to.equal(5);
    })

    it('should compute 3 + 4 * 5', function() {
      expect(calculadora.eval('3 + 4 * 5')).to.equal(35);
    })
  });
  
  // it.only hace que solo se evalue un test
  // xit hace que el test no se compruebe
  

});