const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and modoles
const contactSchema = new Schema({
   name:String,
    age:Number
});
const contacts = mongoose.model('contacts', contactSchema);

module.exports = contacts;

