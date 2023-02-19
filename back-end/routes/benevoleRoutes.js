var express = require('express');
var router = express.Router();
var BenevoleController = require('../controllers/BenevoleController')
const auth = require('../middlewares/auth');

// récuperer la liste de tous les benevoles
router.get('/',BenevoleController.list);

// recuperer un benevole en particulier
router.get('/:id', BenevoleController.show)

//post un benevole a la bd
router.post('/',BenevoleController.create)

//update un benevole particulier
router.put('/:id',BenevoleController.update)

// update les affectations d'un benevole en question
router.put('/:id/affectations',BenevoleController.updateAffectation)

//delete un benevole en particulier
router.delete('/:id',BenevoleController.remove)

//delete many benevoles
router.post('/removeMany',BenevoleController.removeMany)

module.exports = router;
