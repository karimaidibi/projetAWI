// import package mongoose for mongodb
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// un plugin de mongoose
const uniqueValidator = require('mongoose-unique-validator')

//create a schema
const userSchema = new Schema({
    'email' : {type: String, required: false, unique: true},
    'password' : {type: String, required: true}
});

userSchema.plugin(uniqueValidator)

// exporter le model de données
module.exports = mongoose.model('User', userSchema)