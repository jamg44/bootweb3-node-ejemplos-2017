'use strict';

module.exports = function() { // devuelve un middleware que si no hay usuario redirige al login
  return function(req, res, next) {
    if (!req.session.authUser) {
      // redirigimos al login
      res.redirect('/login');
      return;
    }
    // el usuario está autenticado
    next();
  }
}