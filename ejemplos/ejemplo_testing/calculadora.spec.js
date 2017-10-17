const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewire = require('rewire');
const nock = require('nock');
const Calculadora = rewire('./calculadora');

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

  it('parse() should write result to log', function() {
    sinon.spy(calculadora, 'log');
    calculadora.parse('1 + 2');
    expect(calculadora.log.callCount).to.equal(1);
    calculadora.log.restore();
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

  it('sumaPromise() should return a promise', function() {
    expect(calculadora.sumaPromise(1 , 5)).to.be.a('promise');
  }); 

  it('sumaPromise() should resolve to sum of 4 + 5', function(done) {
    calculadora.sumaPromise(4, 5).then( res => {
      expect(res).to.equal(9);
      done();
    });
  });

  it('sumaPromise can be used with async/await', async function() {
    const resultado = await calculadora.sumaPromise(4, 5);
    expect(resultado).to.equal(9);
  });

  it('fileHeader() should read a file first line', function(done) {
    //const Calculadora2 = rewire('./calculadora.js');
    Calculadora.__set__('fs', {
      readFile(file, cb) {
        cb(null, 'primera linea\nsegunda linea');
      }
    })
    const calculadora = new Calculadora();

    calculadora.fileHeader('zzz.xy', function(err, result) {
      expect(result).to.equal('primera linea');
      done();
    });
  });

  it('httpGetName should use network request to obtain name', async function() {
    nock('https://swapi.co')
      .get('/api/people/1')
      .reply(200, { name: 'FAKENAME'});
    const name = await calculadora.httpGetName();
    expect(name).to.equal('FAKENAME');
  });

  // it.only hace que solo se evalue un test
  // xit hace que el test no se compruebe

});