var express = require('express');
var router = express.Router();

router.get('/', index);
module.exports.index = index;
function index(req, res, next) {
  res.render('hola');
}

module.exports.router = router;