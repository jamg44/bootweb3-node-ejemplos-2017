
function Calculadora() {}

Calculadora.prototype.operators = ['+', '-', '*'];

Calculadora.prototype.sum = function( a = 0, b = 0) {
  return a + b;
}

Calculadora.prototype.sumAfter = function( a, b, ms, callback) {
  setTimeout(() => {
    const result = this.sum(a, b);
    callback(result);
  }, ms);
}

Calculadora.prototype.subtract = function( a, b) {
  return a - b;
}

Calculadora.prototype.parse = function(expression) {
  const result = [];
  //for (const iterador of expression.split(' ').entries()) {
    //const index = iterador[0];
    //const item = iterador[1];
  for (const [index, item] of expression.split(' ').entries()) {
    
    
    if (this.operators.includes(item)) {
      // si es una posición par lanzo excepción
      if (index % 2 === 0) { // es par
        throw new TypeError(`Unexpected item ${item} found`);
      }
      result.push(item);
    } else {
      const number = Number(item);
      if (index % 2 !== 0) { // es impar
        throw new TypeError(`Unexpected item ${item} found`);
      }
      if (isNaN(number)) {
        throw new TypeError(`Unknown item ${item} found`);
      }
      result.push(number);
    }
  }
  return result;
}

Calculadora.prototype.eval = function(expression) {
  let operator = null;
  let result = null;
  for(const item of this.parse(expression)) {
    // si es un operador, lo guardamos y pasamos el siguiente
    if (this.operators.includes(item)) {
      operator = item;
      continue;
    }
    // es un número, si es el primero lo guardo en el resultado
    if (result === null) {
      result = item;
      continue;
    }
    // si no es el primero hago la operación guardada
    switch (operator) {
      case '+': result += item; break;
      case '-': result -= item; break;
      case '*': result *= item; break;
      default: 
        throw new TypeError(`Unknown operator ${operator} found`);
        break;
    }
    operator = null;
  }
  return result;
}

module.exports = Calculadora;
