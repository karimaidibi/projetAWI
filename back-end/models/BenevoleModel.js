// import package mongoose for mongodb
const mongoose = require('mongoose')
const Schema = mongoose.Schema


//create a schema
const benevole = new Schema({
    prenom : {type : String, required : true},
    nom : {type : String, required : true},
    'email' : {type: String, required: false, unique: true},
    affectations : {type : Array, required : false}
});


// exporter le model de données
module.exports  = mongoose.model('Benevole', benevole)