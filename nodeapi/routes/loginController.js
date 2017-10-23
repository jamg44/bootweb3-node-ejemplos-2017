'use tsrict';

const Usuario = require('../models/Usuario');
const i18n = require('../lib/i18nConfigure')();

class LoginController {
  index(req, res, next) {
    res.locals.email = 'admin@example.com'; // para que la vista tenga el email
    res.locals.error = '';
    res.render('login');
  }

  // POST /login
  async post(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    // hacemos un hash de la password
    const hashedPassword = Usuario.hashPassword(password);

    const user = await Usuario.findOne({ email: email, password: hashedPassword });

    if (!user) {
      // Mantenemos al usuario en esta página
      res.locals.email = email; // para que la vista tenga el email que me mandó
      res.locals.error = i18n.__('Invalid credentials');
      res.render('login');
      return;
    }

    // el usuario está y coincide la password
    
    // apuntamos el usuario en la sesión
    req.session.authUser = { _id: user._id };

    // le mandamos a la home
    res.redirect('/');
  }

  logout(req, res, next) {
    delete req.session.authUser;
    req.session.regenerate(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  }
}

module.exports = new LoginController();
