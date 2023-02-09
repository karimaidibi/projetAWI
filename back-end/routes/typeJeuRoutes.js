var express = require('express');
var router = express.Router();
var TypeJeuController = require('../controllers/TypeJeuController')
// const multerConfig = require('../middlewares/multer.config')
// const auth = require('../middlewares/auth');
// const authAdmin = require('../middlewares/authAdmin');

// récuperer la liste de tous les TypeJeu
router.get('/',TypeJeuController.list);

// recuperer un TypeJeu en particulier
router.get('/:id', TypeJeuController.show)

//post un TypeJeu a la bd
router.post('/',TypeJeuController.create)

//update un TypeJeu particulier
router.put('/:id',TypeJeuController.update)

//delete un TypeJeu en particulier
router.delete('/:id',TypeJeuController.remove)

module.exports = router;
