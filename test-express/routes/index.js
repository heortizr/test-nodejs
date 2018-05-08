var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var cb0 = function(req, res, next){
  console.log('CB0');
  next();
}

var cb1 = function(req, res, next){
  console.log('CB1');
  next();
}

router.get('/example/d', [cb0, cb1], function(req, res, next){
  console.log('the response will be sent by the next function...');
  next();
}, function(req, res, next){
  res.send('Hello World from D!');
});

module.exports = router;
