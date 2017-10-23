'use tsrict';

const Usuario = require('../models/Usuario');

class LoginController {
  index(req, res, next) {
    res.locals.email = ''; // para que la vista tenga el email
    res.locals.error = '';
    res.render('login');
  }

  // POST /login
  async post(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);

    const user = await Usuario.findOne({ email: email, password: password });

    console.log('user', user);

    res.locals.email = email; // para que la vista tenga el email que me mandó
    res.locals.error = '';
    res.render('login');
  }
}

module.exports = new LoginController();
