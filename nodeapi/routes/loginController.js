'use tsrict';

class LoginController {
  index(req, res, next) {
    res.render('login');
  }
}

module.exports = new LoginController();
