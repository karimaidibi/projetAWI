// import package mongoose for mongodb
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create a schema
const typeJeu = new Schema({
    type : {type : String, required : true},
});

exports.typeJeuSchema = typeJeu

// exporter le model de données
module.exports = mongoose.model('TypeJeu', typeJeu)