const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and modoles

let ContactSchema = Schema({

    Name: String,
    Subject: String,
    Email: String,
    Message: String,
    Date:Date

});

let Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;

