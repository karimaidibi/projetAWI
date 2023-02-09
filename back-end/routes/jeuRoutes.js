var express = require('express');
var router = express.Router();
var JeuController = require('../controllers/JeuController')

const auth = require('../middlewares/auth');

// récuperer la liste de tous les Jeux
router.get('/',JeuController.list);

// recuperer un Jeux en particulier
router.get('/:id', JeuController.show)

//post un Jeux a la bd
router.post('/',JeuController.create)

//update un Jeux particulier
router.put('/:id',JeuController.update)

// Update la zone d'un jeu en question
router.put('/:id/zone',JeuController.updateZoneOfJeu)

// Update le type de jeu d'un jeu en question
router.put('/:id/typeJeu',JeuController.updateTypeJeuOfJeu)

//delete un Jeux en particulier
router.delete('/:id',JeuController.remove)

module.exports = router;
