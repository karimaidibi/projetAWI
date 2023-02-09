const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, 'public/images/toiles');
    },
    filename: (req, file, callback)=>{
        //récuperer un nombre aleatoire entre 0 et ce nombre 
        var name = Math.floor(Math.random() * Math.floor(15258652325)).toString()

        const extension = MIME_TYPES[file.mimetype] // recuperer l'extension approprié
        name += "."+extension;

        callback(null, name);
    }
})

module.exports = multer({storage}).single('image')