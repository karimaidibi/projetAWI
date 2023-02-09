var express = require('express');
var router = express.Router();
var ZoneController = require('../controllers/ZoneController')

// récuperer la liste de tous les produits
router.get('/',ZoneController.list);

// recuperer un produit en particulier
router.get('/:id', ZoneController.show)

//post un produit a la bd
router.post('/',ZoneController.create)

//update un produit particulier
router.put('/:id',ZoneController.update)

//delete un produit en particulier
router.delete('/:id',ZoneController.remove)

module.exports = router;
