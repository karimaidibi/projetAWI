var express = require('express');
var router = express.Router();
var BenevoleController = require('../controllers/BenevoleController')

// récuperer la liste de tous les Jeux
router.get('/',BenevoleController.list);

// recuperer un Jeux en particulier
router.get('/:id', BenevoleController.show)

//post un Jeux a la bd
router.post('/',BenevoleController.create)

//update un Jeux particulier
router.put('/:id',BenevoleController.update)

// update les affectations d'un benevole en question
router.put('/:id/affectations',BenevoleController.updateAffectation)

//delete un Jeux en particulier
router.delete('/:id',BenevoleController.remove)

module.exports = router;
