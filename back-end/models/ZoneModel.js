// import package mongoose for mongodb
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create a schema
const zone = new Schema({
    nom: {type : String, required : true}
});

exports.zoneSchema = zone


// exporter le model de données
module.exports = mongoose.model('Zone', zone)