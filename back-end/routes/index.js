var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const methodes = [
    "get",
    "post",
    "put",
    "delete",
     
  ];
  const routes = ["benevoles","jeux","typesJeux", "zones"];
  res.render('index', { title: 'Express', routes: routes, methodes: methodes });
});

module.exports = router;
