// import package mongoose for mongodb
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ZoneModel = require('./ZoneModel');
const TypeJeuModel = require('./TypeJeuModel');
const zone = ZoneModel.zoneSchema
const typeJeu = TypeJeuModel.typeJeuSchema

//create a schema
const jeu = new Schema({
    nom: {type : String, required : true},
    zone: {type : Object, required : false},
    typeJeu: {type : Object, required : true},

});


// exporter le model de données
module.exports = mongoose.model('Jeu', jeu)